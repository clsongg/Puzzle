/*
1. 퍼즐 랜덤으로 섞어서 뿌리기 (+ 위치)
2. 퍼즐 랜덤에 맞게 백그라운드 이미지 설정
3. 애니메이션 설정 (퍼즐 조각의 width 만큼 움직임. 대각선 X)
4. 로컬 스토리지로 로그 내역 찍기
*/
var m4 = m4 || {};
m4.hasJqueryObject = function($elem){return $elem.length > 0;};
m4.puzzle = new function() {
	this.init = function() {
		//변수처리
		this.puzzleWrap = $('.puzzleWrap'); //m4.puzzle.puzzleWrap
		this.piece = $('.puzzleWrap div'); //m4.puzzle.piece
		this.pieceWh = 200; //m4.puzzle.pieceWh
		this.col = 3; //m4.puzzle.col
		this.row = 3; //m4.puzzle.row
		this.pieceTotalNum = m4.puzzle.col * m4.puzzle.row; //m4.puzzle.pieceTotalNum
		this.pieceNum = m4.puzzle.pieceTotalNum - 1;//m4.puzzle.pieceNum
		this.puzzleWrapW = m4.puzzle.pieceWh * m4.puzzle.row; //m4.puzzle.puzzleWrapW
		this.puzzleWrapH = m4.puzzle.pieceWh * m4.puzzle.col; //m4.puzzle.puzzleWrapH
		this.logWrap = $('.logWrap'); //m4.puzzle.logWrap
		this.logArr = [];

		//초기화
		this.reset();
		this.puzzleIdx();
		this.addEvent();
		this.log();
	};

	this.reset = function() {
		//리셋 클릭
		$('.btnReset').on('click', function() {
			//퍼즐 다시 설정
			m4.puzzle.puzzleIdx();
			//로컬 스토리지 비우기, 화면에 보이는 로그 지우기, 배열 배우기
			localStorage.clear();
			m4.puzzle.logWrap.html('');
			m4.puzzle.logArr = [];
		});
	};

	this.puzzleIdx = function() {
		var arr = [];
		arr = m4.puzzle.mixPuzzle(m4.puzzle.pieceNum);
		var leftX, topY;
		var html = '';

		//puzzleWrap 가로, 세로 설정
		m4.puzzle.puzzleWrap.css({
			'width' : m4.puzzle.puzzleWrapW + 'px',
			'height' : m4.puzzle.puzzleWrapH + 'px'
		});

		//조각에 랜덤 숫자담아 위치 설정
		for(var i = 0; i < m4.puzzle.pieceNum; i++) {
			leftX = m4.puzzle.pieceWh * (i % m4.puzzle.row);
			topY = m4.puzzle.pieceWh * parseInt(i / m4.puzzle.col);
			arr.push(i);
			html += '<div data-owner-idx="' + i + '" data-idx="'+ arr[i] + '" style="left:' + leftX + 'px;top:' + topY + 'px;width:' + m4.puzzle.pieceWh + 'px;height:' + m4.puzzle.pieceWh + 'px;"></div>'
		}
		html += '<div class="blank" style="left:' + m4.puzzle.pieceWh * (m4.puzzle.row - 1) + 'px;top:' + m4.puzzle.pieceWh * (m4.puzzle.col - 1) + 'px;width:' + m4.puzzle.pieceWh + 'px;height:' + m4.puzzle.pieceWh + 'px;"></div>'
		m4.puzzle.puzzleWrap.html(html);

		//랜덤으로 뿌려진 숫자에 해당 이미지 설정
		for(var i = 0; i < m4.puzzle.pieceNum; i++) {
			var pieceIdx = m4.puzzle.puzzleWrap.find('div').eq(i).attr('data-idx');
			leftX = m4.puzzle.pieceWh * (pieceIdx % m4.puzzle.row);
			topY = m4.puzzle.pieceWh * parseInt(pieceIdx / m4.puzzle.col);
			m4.puzzle.puzzleWrap.find('div').eq(i).css({
				'background-position-x' : -leftX,
				'background-position-y' : -topY
			});
		}
	};

	this.mixPuzzle = function(n) {
		var arr = [];
		var temp;
		var rnum;

		for(var i = 0; i < n; i++){
			arr.push(i);
		}

		for(var i = 0; i < arr.length; i++){
			rnum = Math.floor(Math.random() * n);
			temp = arr[i];
			arr[i] = arr[rnum];
			arr[rnum] = temp;
		}
		return arr;
	};

	this.addEvent = function() {
		//퍼즐 클릭
		$(document).on( 'click', m4.puzzle.piece, function(e) {
			//console.log(e.target); // $(e.target); 이벤트 타겟. 이벤트를 상속받는 애들
			var thisLeftX = parseInt($(e.target).css('left'));
			var thisTopY = parseInt($(e.target).css('top'));
			var blank = $('.blank');
			var blankLeftX = parseInt(blank.css('left'));
			var blankTopY = parseInt(blank.css('top'));
			var AbsX = Math.abs(blankLeftX - thisLeftX);
			var AbsY = Math.abs(blankTopY - thisTopY);

			//console.log(blankLeftX + ' : ' + thisLeftX);
			//console.log(blankTopY + ' : ' + blankTopY);

			if($(e.target).attr('data-idx') && blank.is(':animated') == false && !(AbsX > m4.puzzle.pieceWh) && !(AbsY > m4.puzzle.pieceWh) && (AbsX !== AbsY)) {
				$(e.target).animate({
					'left' : blankLeftX,
					'top' : blankTopY
				});

				blank.animate({
					'left' : thisLeftX,
					'top' : thisTopY
				});

				//로컬 스토리지 저장
				m4.puzzle.logArr.push({
					'targetIdx' : $(e.target).attr('data-owner-idx'),
					'moveX' : blankLeftX,
					'moveY' : blankTopY
				});
				localStorage.setItem('logArr', JSON.stringify(m4.puzzle.logArr));
				m4.puzzle.log($(e.target).attr('data-owner-idx'), blankLeftX, blankTopY);
			}
		});
	};

	this.log = function(targetIdx, moveX, moveY) {
		//console.log(targetIdx + ':' + moveX + ':' + moveY);
		var log = '';
		if(localStorage.length > 0 && !m4.puzzle.logArr.length) {//로그 있으면 화면에 보여주기
			m4.puzzle.logArr = JSON.parse(localStorage.getItem('logArr'));
			for (var i = 0;i < m4.puzzle.logArr.length;i++) {
				log += '<p>퍼즐Idx : ' + m4.puzzle.logArr[i].targetIdx + ' / 퍼즐X : ' + m4.puzzle.logArr[i].moveX + ' / 퍼즐Y : ' + m4.puzzle.logArr[i].moveY +'</p>';
			}
			m4.puzzle.logWrap.append(log);
		}else if(localStorage.length > 0 && m4.puzzle.logArr.length > 0){//로그 추가하기
			log += '<p>퍼즐Idx : ' + targetIdx + ' / 퍼즐X : ' + moveX + ' / 퍼즐Y : ' + moveY +'</p>';
			m4.puzzle.logWrap.append(log);
		}
	};
};

$( function() {
	m4.puzzle.init();
});
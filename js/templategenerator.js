templateGenerator();

/* テンプレートジェネレ―タ―ここから */
function templateGenerator() {	
	/* 変数を定義する */
	var NAMESPACE        = 'mizzzTemplateGenerator',
		storage          = {},
		storageFlg       = false,
		$html            = $('html');
		$form            = $('#generate-form'),
		$resultContainer = $('#result-container'),
		$resultHTMLCode  = $('#result-html-code'),
		$btnGenerate     = $('#btn-generate'),
		$btnReset        = $('#btn-reset'),
		$btnSelection    = $('#btn-selection'),
		$btnSave         = $('#btn-save'),
		$btnLoad         = $('#btn-load'),
		$btnDelete       = $('#btn-delete'),
		$btnReset        = $('#btn-reset'),
		$buttonset       = $('.buttonset'),
		$dialog          = $('#dialog'),
	    $options = {
		    lang         : '',
		    charset      : '',
		    viewport     : '',
		    linkstyle    : '',
		    linkjs       : '',
		    CDNjQuery    : '',
		    CDNjQueryUI  : '',
		    CDNmodernizr : '',
		    inlinestyle  : '',
		    inlinejs     : '',
		    indentType   : ''
	    };

	/* jQueryUIボタン */
	$btnGenerate.button();
	$btnReset.button();
	$btnSelection.button();
	$btnSave.button();
	$btnLoad.button();
	$btnDelete.button();
	$buttonset.buttonset();

	/* 初期時、結果エリアを非表示にする */
	$resultContainer.hide();
	/* 初期時、セーブボタンを使用不可にする */
	$btnSave.button('disable');
	
	/* IE8以下はストレージサービスを使用不可にする */
	if($html.is('.ie6, .ie7, .ie8')) {
		$('#control-area-right').hide();
	}

	/* 送信時の処理を登録する */
	$form.bind('submit', function(event) {

		event.preventDefault();
		if(!storageFlg) {
			$options.lang         = $form.find('[name=lang]:checked').val(),
			$options.charset      = $form.find('[name=charset]:checked').val(),
			$options.viewport     = ｇeｔMultipleOption($form.find('[name=viewport]:checked')),
			$options.linkstyle    = $form.find('[name=linkstyle]:checked').val(),
			$options.linkjs       = $form.find('[name=linkjs]:checked').val(),
			$options.CDNjQuery    = $form.find('[name=CDNjQuery]:checked').val(),
			$options.CDNjQueryUI  = $form.find('[name=CDNjQueryUI]:checked').val(),
			$options.CDNmodernizr = $form.find('[name=CDNmodernizr]:checked').val(),
			$options.inlinestyle  = $form.find('[name=inlinestyle]:checked').val(),
			$options.inlinejs     = $form.find('[name=inlinejs]:checked').val();
			$options.indentType   = $form.find('[name=indent]:checked').val();
			$('#btn-save').button('enable');
		}
		storageFlg = false;
		var indent = getindent($options.indentType);
		
		var resHTML  = addCode(code['html']['docType'], '', 0);
		    resHTML += addCode(code["html"]['langCode'], $options.lang, 0);
		    resHTML += addCode(code['html']['head'], '', 0);
		    resHTML += addCode(code["html"]['charset'], $options.charset, 1);
		    resHTML += addCode(code['html']['viewport'], $options.viewport, 1);		
		    resHTML += addCode(code['html']['title'], '', 1);
		    resHTML += addCode(code['html']['discription'], '', 1);
		    resHTML += addCode(code['html']['Keywords'], '', 1);
		    resHTML += addCode(code["html"]['linkstyle'], $options.linkstyle, 1);
		    resHTML += addCode(code["html"]['CDNjQuery'], $options.CDNjQuery, 1);
		    resHTML += addCode(code["html"]['CDNjQueryUI'], $options.CDNjQueryUI, 1);
		    resHTML += addCode(code["html"]['CDNmodernizr'], $options.CDNmodernizr, 1);
		    resHTML += addCode(code["html"]['linkjs'], $options.linkjs, 1);
		    resHTML += addCode(code["html"]['inlinestyle'], $options.inlinestyle, 1, 'mulline');
		    resHTML += addCode(code["html"]['inlinejs'], $options.inlinejs, 1, 'mulline');
		    resHTML += addCode(code['html']['headBody'], '', 0);
		    resHTML += addCode(code['html']['bodyHtml'], '', 0);
		
		/* ダイアログを閉じる */
		$dialog.dialog('close');

		/* 結果コードを表示する */
		$resultHTMLCode.val(resHTML);
		$resultContainer.slideDown('fast', function() { $resultHTMLCode.select(); });

		/* 結果コードを追加する */	
		function addCode(code, optionValue, indentValue, ex) {
			var code = code;
			/* 追加しない(オプション設定値なし) */
			if(optionValue === undefined) return '';
			
			/* 複数行の結果コードは各業にインデントを指定する */
			if(ex == 'mulline') code = getMultiLine(code, indentValue);

			return ｇeｔCode(code, optionValue, indentValue);
		}
		
		/* 結果コードを組み立てる */
		function ｇeｔCode(code, optionValue, indentValue) {
			var resultCode = '';
			resultCode += indent[indentValue];
			$.each(code, function(i, val) {
				if(/^(\$[1-9]+)$/.test(val)) {
					val = optionValue;
				}
				resultCode += val;
			});
			return resultCode;
		}
		
		/* 複数のオプション値を取得 */
		function ｇeｔMultipleOption(optionValue) {
			if(optionValue.length == 0) return optionValue[0];// undefinedを返す
			var resultOption = '';
			var optionValue = optionValue.map(function() { return $(this).data('viewport'); }).toArray();
			$.each(optionValue, function(i, val) {
				resultOption += ',' + val;
			});
			resultOption = resultOption.slice(1);
			return resultOption;
		}
		
		/* 複数行にわたる結果コードを取得 */
		function getMultiLine(code, indentValue) {
			var resultCode = [];
			resultCode = $.map(code, function(val, i) {
				var resultVal = '';
				if(i > 0)  {
					return indent[indentValue] + val;
				} else {
					return val;
				}
			});
			return resultCode;
		}
		
		/* インデントの方法を指定する */
		function getindent(indentType) {
			var indentNum    = 10,
			    indentResArr = [''],
			    indent = {
					none   : '',
					tab    : '\t',
					space2 : '  ',
					space4 : '    '
				}
			for (var i = 0; i < indentNum; i++) {
				var indentTxt = '';
				for (var j = 0; j <= i; j++) {
					indentTxt += indent[indentType];
				};
				indentResArr.push(indentTxt);
			};
			return indentResArr;
		}
	});


	// 結果コードを全選択する
	$btnSelection.click(function(event) {
		$resultHTMLCode.select();
	});


	/* ローカルストレージ */
	// オプションを保存する
	$btnSave.click(function(event) {
		storage['options'] = $options;
		localStorage[NAMESPACE] = JSON.stringify(storage);
		
		$(this).button('disable').removeClass('ui-state-hover ui-state-focus');
		/* ダイアログ表示 */
		showDialog('save');
	});
	
	// オプションを読みこむ
	$btnLoad.click(function(event) {
		if(!localStorage[NAMESPACE]) {
			/* ダイアログ表示 */
			showDialog('nodata');
			return;
		};
		storage    = JSON.parse(localStorage[NAMESPACE]);
		storageFlg = true;
		
		$options.lang         = storage['options']['lang'];
		$options.charset      = storage['options']['charset'];
		$options.viewport     = storage['options']['viewport'];
		$options.linkstyle    = storage['options']['linkstyle'];
		$options.linkjs       = storage['options']['linkjs'];
		$options.CDNjQuery    = storage['options']['CDNjQuery'];
		$options.CDNjQueryUI  = storage['options']['CDNjQueryUI'];
		$options.CDNmodernizr = storage['options']['CDNmodernizr'];
		$options.inlinestyle  = storage['options']['inlinestyle'];
		$options.inlinejs     = storage['options']['inlinejs'];
		$options.indentType   =  storage['options']['indentType'];		
		var viewportArr = $options.viewport ? $options.viewport.split(',') : [];
		
		$form.triggerHandler('submit');

		/* ダイアログ表示 */
		// showDialog('load');

		$('#selection-area-2').find('.ui-state-active').trigger('click');
		
		/* ボタン表示を更新する */
		$.each(storage['options'], function(key, val) {
			switch(key) {
				case 'lang':
				case 'charset':
				case 'indentType':
					$form.find('#' + val).trigger('click');
					break;
				case 'viewport':
					$.each(viewportArr, function(i, val) {
						$form.find('#' + val).next().trigger('click');
					});
					break;
				default:
					$form.find('#' + val).next().trigger('click');
			}
		});
	});
	
	// 削除
	$btnDelete.click(function(event) {
		if(!localStorage[NAMESPACE]) {
			/* ダイアログ表示 */
			showDialog('nodata');
			return;
		}
		delete localStorage[NAMESPACE];
		storage = {};
		/* ダイアログ表示 */
		showDialog('del');
	});

	// リセット
	$btnReset.click(function(event) {
		$btnSave.trigger('customreset');
	});
	// リセット時のカスタムイベント登録
	$btnSave.bind('customreset', function(event) {
		/* セーブボタンを使用不可にする */
		$btnSave.button('disable');
		/* ダイアログを閉じる */
		$dialog.dialog('close');
	});

	// ストレージ操作時のダイアログ
	function showDialog(Pattern) {
		var dialogText = {
			save   : '設定データをセーブしました',
			load   : '設定データをロードしました',
			del    : '設定データを削除しました',
			nodata : '設定データがありません'
		}
		// ダイアログを開く
		$dialog.html(dialogText[Pattern]).dialog({
			title : '設定データ'
		});
	}
	// ダイアログイベント登録
	// $dialog.bind('dialogopen', function(event) {
		// setTimeout(function() {
		// 	$dialog.dialog('close');
		// }, 3000);
	// });

	/* 結果コード用のテンプレート */
	// '$~'はオプション値代入用のプレースホルダー
	var code = {
		html : {
			docType      : ['<!DOCTYPE html>\n'],
			
			langCode     : ['<html lang="', '$1', '">\n'],
			
			head         : ['<head>\n'],
		
			charset      : ['<meta charset="', '$1', '">\n'],
		
			title        : ['<title></title>\n'],
			
			discription  : ['<meta name="description" content="">\n'],
			
			Keywords     : ['<meta name="keywords" content="">\n'],
					
			viewport     : ['<meta name="viewport" content="', '$1', '">\n'],
			
			linkstyle    : ['<link rel="stylesheet" href="css/XXXX.css" media="all">\n'],
			
			linkjs       : ['<script src="js/XXXX.js"></script>\n'],
			
			CDNjQuery    : ['<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>\n'],

			CDNjQueryUI  : ['<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"></script>\n'],

			CDNmodernizr : ['<script src="http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.5.3/modernizr.min.js"></script>\n'],
		
			inlinestyle  : ['<style>\n', '/* Write code */\n', '</style>\n'],

			inlinejs     : ['<script>\n', '/* Write code */\n', '</script>\n'],
						
			headBody     : ['</head>\n<body>\n'],

			header       : ['<header>\n', '</header>\n'],
			
			bodyHtml     : ['</body>\n</html>']
		},
		css : {
			/* css設定 */
		}
	};
}
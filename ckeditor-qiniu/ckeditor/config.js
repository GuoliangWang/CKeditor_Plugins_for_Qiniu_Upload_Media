CKEDITOR.editorConfig = function( config ) {
	config.plugins = 'dialogui,dialog,a11yhelp,autogrow,dialogadvtab,basicstyles,blockquote,clipboard,button,panelbutton,panel,floatpanel,colorbutton,menu,contextmenu,resize,toolbar,elementspath,enterkey,entities,popup,filebrowser,floatingspace,listblock,richcombo,font,format,htmlwriter,wysiwygarea,image,imagepaste,indent,indentblock,indentlist,justify,fakeobjects,link,list,maximize,removeformat,sourcearea,table,tabletools,undo,notification,liststyle,lineutils,widget,filetools,notificationaggregator,uploadwidget,uploadimage';//,codesnippet,templates,pastetext,pastefromword
	config.skin = 'moono';
	config.uiColor = '#F1F5F2';
    config.filebrowserImageBrowseUrl = "";
    config.filebrowserFlashBrowseUrl = "";
    config.filebrowserImageUploadUrl  = "";
	config.autoParagraph = false;
    config.enterMode = CKEDITOR.ENTER_BR;
	config.shiftEnterMode = CKEDITOR.ENTER_P; 
	config.removeButtons = 'Cut,Copy,Paste,Italic,Underline,Strike,CreateDiv,Anchor,Styles,Table';//Font,BGColor,JustifyBlock
	config.autoGrow_onStartup = true;
	config.autoGrow_minHeight = 300;
	config.autoGrow_maxHeight = 450;
	config.autoGrow_bottomSpace = 50;
	config.font_names = "微软雅黑/微软雅黑;宋体/宋体;黑体/黑体;仿宋/仿宋_GB2312;楷体/楷体_GB2312;隶书/隶书;幼圆/幼圆;";
	config.allowedContent = true;
};
/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/* global alert */

CKEDITOR.dialog.add( 'embedBaseQiniu', function( editor ) {
	'use strict';

	var lang = editor.lang.embedbase_qiniu;


	var embedQiniuFileinfoId = "embedQiniuFileinfoId";
	var embedQiniuSelectBtnId = "embedQiniuSelectBtnId";
	var embedQiniuSelectBtnContainerId = "embedQiniuSelectBtnContainerId";
	var uploader, uploadToken, fileKey, fileUrl;
	var uptokenFromServer = function() {
	   	return uploadToken;
	}
	var keyFromServer = function() {
	    return fileKey;
	}
	function savetoqiniu() {
		uploader = Qiniu.uploader({
		runtimes: "html5,flash,html4",
		browse_button: embedQiniuSelectBtnId,
		// uptoken: "占位,以防运行错误",
		uptoken_func:uptokenFromServer,
		get_new_uptoken: true,
		domain: qiniu_bucket_domain,
		container: embedQiniuSelectBtnContainerId,
		max_file_size: "40mb",
		filters: {
			mime_types: [{
				title: "Image files",
				extensions: "mp4,MP4"
			}]
		},
		flash_swf_url: "./Moxie.swf",
		max_retries: 3,
		dragdrop: true,
		drop_element: embedQiniuSelectBtnContainerId,
		chunk_size: "4mb",
		auto_start: false,
		multi_selection: false,
		init: {
			"FilesAdded": function(up, files) {
				plupload.each(files,
				function(file) {
					document.getElementById(embedQiniuFileinfoId).innerHTML += '<div id="' + file.id + '">' + file.name + "&nbsp;&nbsp;&nbsp;(" + plupload.formatSize(file.size) + ")&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b></b>	<i></i></div><br>";
				})
				willUploadFilesToQiniu = willUploadFilesToQiniu.concat(files); 
				uploadFilesToQiniu();
			},
			"BeforeUpload": function(up, file) {},
			"UploadProgress": function(up, file) {},
			"FileUploaded": function(up, file, info) {
			    // $('#'+parentCon).find('span').remove();
                var res = JSON.parse(info);
                var sourceLink = fileUrl;
                document.getElementById(file.id).getElementsByTagName("i")[0].innerHTML = sourceLink;
                var dialog = CKEDITOR.dialog.getCurrent();
				dialog.setValueOf('info','url', sourceLink);
			},
			"Error": function(up, err, errTip) {
				console.log(err +"  tip:"+ errTip);
			},
			"UploadComplete": function() {},
			"Key": keyFromServer
		}
	});
	}

	var willUploadFilesToQiniu = [];
	function uploadFilesToQiniu()
	{
		getQiniuUptoken();
	}

	function getQiniuUptoken()
	{
		if (!willUploadFilesToQiniu || willUploadFilesToQiniu.length == 0) {
			return;
		}
		
		 // var requestUrl = urlHelper.urlWithPath('/outingstrategy/app/line_sys/trip_list?');
	  //           var lineId = urlHelper.getParameterByName('line_id');
	  //           var params = urlHelper.defaultParams();
	  //           params.line_id = lineId;
	  //          
	            var file = willUploadFilesToQiniu.shift();
	            var requestUrl =  urlForGetQiniuToken;
	            var fileRealType = file.type.substring(6);
	            var params = {tk:smsLoginToken,ft:"."+fileRealType};//file.type="image/png"
		 		$.ajax({
	                url: requestUrl,
	                type: 'POST',
	                dataType: 'json',
	                data: params
	            })
	            .done(function(data) {
	                console.log("success");
	                console.log(data);
					uploadFileToQiniu(file, data.tk, data.fn, data.url);
	            })
	            .fail(function(data) {
	                console.log("error");
	            })
	            .always(function() {
	                console.log("complete");
	            });  
	}

	function uploadFileToQiniu(pFile, pUploadToken, pFileKey, pUrl)
	{
	 	uploadToken = pUploadToken;
	    fileKey = pFileKey;
	    fileUrl = pUrl;
	    uploader.start();
	}

	return {
		title: lang.title,
		minWidth: 350,
		minHeight: 50,

		onLoad: function() {
			var that = this,
				loadContentRequest = null;

			this.on( 'ok', function( evt ) {
				// We're going to hide it manually, after remote response is fetched.
				evt.data.hide = false;

				// We don't want the widget system to finalize widget insertion (it happens with priority 20).
				evt.stop();

				// Indicate visually that waiting for the response (#13213).
				that.setState( CKEDITOR.DIALOG_STATE_BUSY );

				var url = that.getValueOf( 'info', 'url' );
				var iframe = that.getValueOf( 'info', 'iframe' );
				if ($.trim(url).length != 0) {
					that.widget.setVideoContent(url);
				}
				else if ($.trim(iframe).length != 0) {
					that.widget.setIframeContent(iframe);
				}
				if ( !that.widget.isReady() ) {
					editor.widgets.finalizeCreation( that.widget.wrapper.getParent( true ) );
				}
				editor.fire( 'saveSnapshot' );
				that.hide();
				unlock();

				// loadContentRequest = that.widget.loadContent( url, {
				// 	noNotifications: true,

				// 	callback: function() {
				// 		if ( !that.widget.isReady() ) {
				// 			editor.widgets.finalizeCreation( that.widget.wrapper.getParent( true ) );
				// 		}

				// 		editor.fire( 'saveSnapshot' );

				// 		that.hide();
				// 		unlock();
				// 	},

				// 	errorCallback: function( messageTypeOrMessage ) {
				// 		that.getContentElement( 'info', 'url' ).select();

				// 		alert( that.widget.getErrorMessage( messageTypeOrMessage, url, 'Given' ) );

				// 		unlock();
				// 	}
				// } );
			}, null, null, 15 );

			this.on( 'cancel', function( evt ) {
				if ( evt.data.hide && loadContentRequest ) {
					loadContentRequest.cancel();
					unlock();
				}
			} );

			function unlock() {
				// Visual waiting indicator is no longer needed (#13213).
				that.setState( CKEDITOR.DIALOG_STATE_IDLE );
				loadContentRequest = null;
			}

			savetoqiniu();
		},

		contents: [
			{
				id: 'info',

				elements: [
					{
						type: 'text',
						id: 'iframe',
						label: lang.iframe,
						required: false,

						setup: function( widget ) {
							this.setValue( widget.data.iframe );
						},

						validate: function() {
							var iframe = this.getValue();
							if ($.trim(iframe).length == 0) {
								return true;
							}
							if (iframe.indexOf('<iframe') == -1) {
								return lang.unsupportedIfameGiven;
							}
							return true;
						}
					},
					{
						type: 'text',
						id: 'url',
						label: editor.lang.common.url,
						required: false,

						setup: function( widget ) {
							this.setValue( widget.data.url );
						},

						validate: function() {
							var url = this.getValue();
							if ($.trim(url).length == 0) {
								return true;
							}
							if (url == fileUrl) {
								return true;
							}
							if ( !this.getDialog().widget.isUrlValid( this.getValue() ) ) {
								return lang.unsupportedUrlGiven;
							}

							return true;
						}
					},
					{
						type: 'html',
						id: 'upload',
						html:'<div id="' + embedQiniuFileinfoId + '"></div><div id="' + embedQiniuSelectBtnContainerId + '"><a href="javascript:void(0)" id="' + embedQiniuSelectBtnId +  '">[点击选择文件]</a></div>'
					}
				]
			}
		]
	};

} );

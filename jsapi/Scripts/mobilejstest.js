/************************************摄像头触发与回调函数**********************************************/
   //摄像头模式切换
   function camera_mode_change(){
		var mode = $("#camera_mode").val();//地址本模式
		if(mode=="photo"){
			$(".camera_photo").removeClass("displayNone");
			$(".camera_video").addClass("displayNone");
		} else if(mode=="video"){
			$(".camera_photo").addClass("displayNone");
			$(".camera_video").removeClass("displayNone");
		}
   }
	
	//调用系统相机
    function testCamera() {
        var mode = $("#camera_mode").val();//拍照模式
        var returntype = $("#returntype").val(); //返回类型
        var orientation = $("#orientation").val(); //限制照片方向
        var maxsize = $("#maxsize").val(); //图片大小限制
        if (!maxsize) {
            maxsize = 0;
        }
        var recordGPS = false; //是否记录GPS
        if($('#recordGPS').is(':checked')) {
            recordGPS = true;
        }
        var recordDate = false; //是否记录服务器时间
        if($('#recordDate').is(':checked')) {
            recordDate = true;
        }
        var recordUserInfo = false; //是否记录用户信息
        if ($('#recordUserInfo').is(':checked')) {
            recordUserInfo = true;
        }
        var recordAddress = false; //是否记录地址
        if ($('#recordAddress').is(':checked')) {
            recordAddress = true;
        }
		var maxTime = $("#maxTime").val(); //录像时长限制
        if (!maxTime) {
            maxTime = 0;
        }
        //拍照参数
        var option = {
            callback: testCameraCallBack,
            asyncData: "",
            mode: mode,
            returnType: returntype,
            maxSize: maxsize,
            recordGPS: recordGPS,
            recordDate: recordDate,
            recordUserInfo: recordUserInfo,
            recordAddress: recordAddress,
            maxTime: maxTime,
            orientation: orientation
        }
        MobileJS.camera(option);
    }
    
    //调用系统相机回调函数
    function testCameraCallBack(option) {
		try{
			var retObj = option;
			if (retObj.retCode < 0) {
				alert("错误信息：" + retObj.retMsg);
				return;
			}
			else {
				if (retObj.data.id) {
					$("#imageid").html(retObj.data.id);
					copyTextForFileId(retObj.data.id);
				}
				if (retObj.data.thumbnail) {
					$("#thumbnail").html("<img src=\"data:image/jpg;base64," + retObj.data.thumbnail + "\" width='50' height='50'/>&nbsp;");
				}
				if (retObj.data.image) {
					$("#imagecontent").html("<img src=\"data:image/jpg;base64," + retObj.data.image + "\" width='100' height='100'/>&nbsp;");
				}
				if (retObj.data.fileSize) {
					$("#camera_fileSize").html(retObj.data.fileSize);
				}
				if (retObj.data.fileName) {
					$("#camera_fileName").html(retObj.data.fileName);
				}
				if (retObj.data.fileDate) {
					$("#camera_fileDate").html(retObj.data.fileDate);
				}
				if (retObj.data.userInfo) {
				    $("#camera_userInfo").html(retObj.data.userInfo);
				}
				if (retObj.data.GPS) {
				    $("#camera_gps_longitude").html(retObj.data.GPS.longitude);
				}
				if (retObj.data.GPS) {
				    $("#camera_gps_latitude").html(retObj.data.GPS.latitude);
				}
				if (retObj.data.address) {
				    $("#camera_address").html(retObj.data.address);
				}
			}
		}catch(err){
			alert("回调错误，原因["+err.message+"]");
			return;
		}
    }
/************************************自定义连拍照片触发与回调函数**********************************************/
    //自定义摄像头模式切换
    function yst_camera_mode_change(){
		var mode = $("#yst_camera_mode").val();//地址本模式
		if(mode=="photo"){
			$(".yst_camera_photo").removeClass("displayNone");
			$(".yst_camera_video").addClass("displayNone");
		} else if(mode=="video"){
			$(".yst_camera_photo").addClass("displayNone");
			$(".yst_camera_video").removeClass("displayNone");
		}
   }
    //调用自定义相机连拍照片
    function testYstCamera() {
        var mode = $("#yst_camera_mode").val();//拍照模式
        var returntype = $("#yst_camera_returntype").val(); //返回类型
        var orientation = $("#yst_camera_orientation").val(); //限制方向
        var idtext = $("#yst_camera_idtext").val(); //提示文字
        if (!idtext) {
            idtext = "";
        }
        var start = $("#yst_camera_start").val(); //照片开始数
        if (!start) {
            start = 1;
        }
        var end = $("#yst_camera_end").val(); //照片结束数
        if (!end) {
            end = 9999;
        }
        var maxsize = $("#yst_camera_maxsize").val(); //图片大小限制
        if (!maxsize) {
            maxsize = 0;
        }
        var recordGPS = false; //是否记录GPS
        if($('#yst_camera_recordGPS').is(':checked')) {
            recordGPS = true;
        }
        var recordDate = false; //是否记录服务器时间
        if($('#yst_camera_recordDate').is(':checked')) {
            recordDate = true;
        }
        var recordUserInfo = false; //是否记录用户信息
        if ($('#yst_camera_recordUserInfo').is(':checked')) {
            recordUserInfo = true;
        }
        var recordAddress = false; //是否记录地址
        if ($('#yst_camera_recordAddress').is(':checked')) {
            recordAddress = true;
        }
		var maxTime = $("#yst_camera_maxTime").val(); //录像时长限制
        if (!maxTime) {
            maxTime = 0;
        }
        //拍照参数
        var option = {
            callback: "testYstCameraCallBack",
            asyncData: "",
            mode: mode,
            returnType: returntype,
            text: idtext,
            start: start,
            end: end,
            maxSize: maxsize,
			recordGPS: recordGPS,
			recordDate: recordDate,
			recordUserInfo: recordUserInfo,
			recordAddress: recordAddress,
			maxTime: maxTime,
			orientation: orientation
        }
        
        MobileJS.cameraYst(option);
    }
    
    //连拍照片回调函数
    function testYstCameraCallBack(option) {
		try{
			//var retObj = jQuery.parseJSON(option);
			var retObj = option;
			if (retObj.retCode < 0) {
				alert("错误信息：" + retObj.retMsg);
				return;
			}
			else {
				if (retObj.data.id) {
					$("#yst_camera_imageid").append(retObj.data.id + "|");
					copyTextForFileId(retObj.data.id);
				}
				if (retObj.data.thumbnail) {
					$("#yst_camera_thumbnail").append("<img src=\"data:image/jpg;base64," + retObj.data.thumbnail + "\" width='50' height='50'/>&nbsp;");
				}
				if (retObj.data.image) {
					$("#yst_camera_imagecontent").append("<img src=\"data:image/jpg;base64," + retObj.data.image + "\" width='100' height='100'/>&nbsp;");
				}
				if (retObj.data.fileSize) {
					$("#yst_camera_fileSize").append(retObj.data.fileSize + "|");
				}
				if (retObj.data.fileName) {
					$("#yst_camera_fileName").append(retObj.data.fileName + "|");
				}
				if (retObj.data.fileDate) {
					$("#yst_camera_fileDate").append(retObj.data.fileDate + "|");
				}
				if (retObj.data.userInfo) {
				    $("#yst_camera_userInfo").append(retObj.data.userInfo + "|");
				}
				if (retObj.data.GPS) {
				    $("#yst_camera_gps_longitude").append(retObj.data.GPS.longitude + "|");
				}
				if (retObj.data.GPS) {
				    $("#yst_camera_gps_latitude").append(retObj.data.GPS.latitude + "|");
				}
				if (retObj.data.address) {
				    $("#yst_camera_address").append(retObj.data.address + "|");
				}
			}
		}catch(err){
			alert("回调错误，原因["+err.message+"]");
			return;
		}
    }
	
/************************************获取/上传/删除文件与回调函数**********************************************/
    
    function testQueryFile() {
        var returntype = $("#file_returntype").val(); //返回类型
        var file_source = $("#file_source").val(); //文件来源
		var file_id = $("#file_id").val(); //文件ID
        if (!file_id) {
            alert("请录入文件ID");
			return;
        }
        //参数
        var option = {
            callback: "testQueryFileCallBack",
            asyncData: "",
			id:file_id,
			returnType: returntype,
			source: file_source
        }
        MobileJS.queryFile(option);
    }
	
	//获取文件回调函数
    function testQueryFileCallBack(option) {
		try{
		    //var retObj = jQuery.parseJSON(option);
		    var retObj = option;
			if (retObj.retCode < 0) {
				alert("错误信息：" + retObj.retMsg);
				return;
			}
			else {
				if (retObj.data.id) {
					$("#file_imageid").html(retObj.data.id);
				}
				if (retObj.data.thumbnail) {
					$("#file_thumbnail").html("<img src=\"data:image/jpg;base64," + retObj.data.thumbnail + "\" width='50' height='50'/>&nbsp;");
				}
				if (retObj.data.image) {
					$("#file_imagecontent").html("<img src=\"data:image/jpg;base64," + retObj.data.image + "\" width='100' height='100'/>&nbsp;");
				}
				if (retObj.data.fileSize) {
					$("#file_fileSize").html(retObj.data.fileSize);
				}
				if (retObj.data.fileName) {
					$("#file_fileName").html(retObj.data.fileName);
				}
				if (retObj.data.fileDate) {
					$("#file_fileDate").html(retObj.data.fileDate);
				}
			}
		}catch(err){
			alert("回调错误，原因["+err.message+"]");
			return;
		}
    }
	

/************************************文件上传**********************************************/
    function uploadfile_version_change() {
        var version = $(".uploadFile_version").val();//版本号
        if (version == "1") {
            $(".uploadfile_source_tr").hide();
        } else if (version == "2") {
            $(".uploadfile_source_tr").show();
        }
    }
    function addUploadFileInputClick() {      
        $('.uploadFileInputDiv').clone().last().insertBefore('#btn_uploadFileMore');
    }
    //function testUploadFile(){
    //    var str_ids = $("#uploadFile_ids").val();//文件ID
    //    if(!str_ids){
    //        alert("请先选择要上传的文件！");
    //        return;
    //    }
    //    var uploadUrl = $("#uploadFile_url").val();//上传地址
    //    var uploadParam = $("#uploadFile_param").val();//上传参数
    //    var source = $("#uploadFile_source").val();//上传source
        
    //    var ids = str_ids.split("|");
    //    var data = Array();
    //    for(var i=0;i<ids.length;i++){
    //        data.push({ id: ids[i], uploadUrl: uploadUrl, uploadParam: uploadParam, source: source});
    //    }

    //    //参数
    //    var option = {
    //        callback: "testUploadFileCallBack",
    //        asyncData: "",
    //        source:"0",
    //        data: data
    //    }
    //    MobileJS.uploadFile(option);
    //}

    function testUploadFile() {
        var data = Array();
        var stop = false;
        var version = $(".uploadFile_version").val();//版本号
        if (!version) {
            version = "1";
        }
        $('.uploadFileInputDiv').each(function (index, idxDiv) {
            var uploadId = $(idxDiv).find(".uploadFile_ids").first().val();        
            if (!uploadId) {
                alert("请先选择要上传的文件！");
                stop = true;
                return false;
            }
            var uploadUrl = $(idxDiv).find('.uploadFile_url').first().val();
            var uploadParam = $(idxDiv).find('.uploadFile_param').first().val();
            var source = $(idxDiv).find('.uploadFile_source').first().val();
            var contentType = $(idxDiv).find('.uploadFile_contentType').first().val();
            data.push({ id: uploadId, uploadUrl: uploadUrl, uploadParam: uploadParam, source: source, contentType: contentType });
        });
        if (!stop) {
            //参数
            var option = {
                version:version,
                callback: "testUploadFileCallBack",
                asyncData: "",            
                data: data
            }
            MobileJS.uploadFile(option);
        }
        
    }


    function testUploadFileCallBack(option){
        var retObj = option;
        if (retObj.retCode < 0) {
            alert("错误信息：" + retObj.retMsg);
            return;
        }
        else {
            $("#uploadFile_res").html("");
			var reshtml = "";
            for(var i=0;i<retObj.data.length;i++){
                reshtml += "<ul class='callbackData'>";
                reshtml += "<li>ID："+retObj.data[i].id+"</li>"
                    +"<li>Status："+retObj.data[i].status+"</li>"
					+"<li>Response："+retObj.data[i].response+"</li>"
					+"<li>FileName："+retObj.data[i].fileName+"</li>"
					+"<li>FileSize："+retObj.data[i].fileSize+"</li>"
					+ "<li>Source：" + retObj.data[i].source + "</li>"
                    + "<li>FileDate：" + retObj.data[i].fileDate + "</li>";
				if (retObj.data[i].thumbnail) {
					reshtml += "<li>Thumbnail：<img src=\"data:image/jpg;base64," + retObj.data[i].thumbnail + "\" width='50' height='50'/></li>";
				}
			    reshtml +="</ul>"
            }
			$("#uploadFile_res").append(reshtml);
        }
    }
    

/************************************下载文件**********************************************/
    //版本选择
    function downloadFile_version_change() {
        var version = $(".downloadFile_version").val();//版本号
        if (version == "1") {
            $("#btn_downloadFileMore").hide();
            $("#btn_downloadFileDel").hide();
            $('.downloadFileInputDiv').first().siblings('.downloadFileInputDiv').remove();
        } else if (version == "2") {

            $("#btn_downloadFileMore").show();
            $("#btn_downloadFileDel").show();
        }
    }
    //增加1个文件
    function addDownloadFileInputClick() {
        $('.downloadFileInputDiv').clone().last().insertBefore('#btn_downloadFileMore');
    }
    //删除1个文件
    function delDownloadFileInputClick() {
        if ($('.downloadFileInputDiv').length > 1) {
            $('.downloadFileInputDiv').last().remove();
        }
    }
    //下载文件选择
    function dl_fileName_change(t) {
        var par = $(t).parent().parent().parent();
        $(".dl_fileUrl", par).val($(t).val());
    }

    function testDownloadFile() {
        var version = $(".downloadFile_version").val();//版本号
        if (version == "1")
        {
            var fileName = $(".dl_fileName").find("option:selected").text();//下载的文件名
            var fileUrl = $(".dl_fileUrl").val();//下载的地址
            var fileSize = $(".dl_fileSize").val();//下载的文件大小
            var fileHash = $(".dl_fileHash").val();//下载的文件Hash
            //参数
            var option = {
                version: version,
                callback: "testDownloadFileCallBack",
                asyncData: "",
                fileName: fileName,
                fileUrl: fileUrl,
                fileSize: fileSize,
                fileHash: fileHash
            }
            MobileJS.downloadFile(option);
        }
        else if (version == '2')
        {
            var data = Array();
            var stop = false;
            $('.downloadFileInputDiv').each(function (index, idxDiv) {
                var downloadfile = $(idxDiv).find(".dl_fileUrl").first().val();
                if (!downloadfile) {
                    alert("请先选择要下载的文件！");
                    stop = true;
                    return false;
                }
                var fileName = $(idxDiv).find('.dl_fileName').first().find("option:selected").text();//下载的文件名
                var fileUrl = $(idxDiv).find('.dl_fileUrl').first().val();//下载的地址
                var fileSize = $(idxDiv).find('.dl_fileSize').first().val();//下载的文件大小
                var fileHash = $(idxDiv).find('.dl_fileHash').first().val();//下载的文件Hash

                data.push({ fileName: fileName, fileUrl: fileUrl, fileSize: fileSize, fileHash: fileHash });
            });
            if (!stop) {
                //参数
                var option = {
                    version: version,
                    callback: "testDownloadFileCallBack",
                    asyncData: "",
                    data: data
                }
                MobileJS.downloadFile(option);
            }
        }
    }

    //下载文件回调函数
    function testDownloadFileCallBack(option) {
		try{
		    var retObj = option;
		    alert(obj2string(retObj));
			if (retObj.retCode < 0) {
				alert("错误信息：" + retObj.retMsg);
				return;
			}
			else {
			    //if (!jQuery.isArray(retObj.data)) {
			    //    var d = new Array();
			    //    d.push(retObj.data);
			    //    retObj.data = d;
			    //} 
			    //$("#downloadFile_res").html("");
			    var reshtml = "";
			    //for (var i = 0; i < retObj.data.length; i++) {
			        reshtml += "<ul class='callbackData'>";
			        reshtml += "<li>ID：" + retObj.data.id + "</li>"
                        + "<li>Status：" + retObj.data.status + "</li>"
                        + "<li>FileName：" + retObj.data.fileName + "</li>"
                        + "<li>FileUrl：" + retObj.data.fileUrl + "</li>"
                        + "<li>FileSize：" + retObj.data.fileSize + "</li>"
                        + "<li>FileHash：" + retObj.data.fileHash + "</li>";
			        if (retObj.data.thumbnail) {
			            reshtml += "<li>Thumbnail：<img src=\"data:image/jpg;base64," + retObj.data.thumbnail + "\" width='50' height='50'/></li>";
			        }
			        reshtml += "</ul>"
			    //}
				$("#downloadFile_res").append(reshtml);
			} 
		}catch(err){
			alert("回调错误，原因["+err.message+"]");
			return;
		}
    }

/************************************预览文件**********************************************/
    
    function previewFile_version_change() {
        var version = $(".previewFile_version").val();//版本号
        if (version == "1") {
            $(".previewFileVersionOneInputDiv").show();
            $(".previewFileInputDiv").hide();
            $("#btn_previewFileMore").hide();         
        } else if (version == "2") {
            $("#btn_previewFileMore").show();
            $(".previewFileInputDiv").show();
            $(".previewFileVersionOneInputDiv").hide();
        }
    }
    function addPreviewFileInputClick() {
        $('.previewFileInputDiv_Table').clone().last().appendTo(".previewFileInputDiv");
    }
    
    function testPreviewFile() {
        var version = $(".previewFile_version").val();//版本号
        if (version && version == "1") {   //版本1只能传单个文件
            var fileid = $("#previewFileVersionOne_id").val();//文件id

            //参数
            var option = {
                version: version,
                callback: testPreviewFileCallBackVersionOne,
                asyncData: "",
                id: fileid
            }
            MobileJS.previewFile(option);
        } else if (version && version == "2") {
            var data = Array();
            var stop = false;
            $('.previewFileInputDiv_Table').each(function (index, idxDiv) {
                var previewId = $(idxDiv).find(".previewFile_id").first().val();
                if (!previewId) {
                    alert("请输入文件ID！");
                    stop = true;
                    return false;
                }
                var source = $(idxDiv).find('.previewFile_source').first().val();
                data.push({ id: previewId, source: source});
            });
            var curIndex = $("#previewFile_curIndex").val();
            if (data.length <= parseInt(curIndex) || parseInt(curIndex) < 0) {
                alert("curIndex错误");
            }
            if (!stop) {
                //参数
                var option = {
                    version: version,
                    callback: "testPreviewFileCallBackVersionTwo",
                    asyncData: "",
                    curIndex: curIndex,
                    data: data
                }
                MobileJS.previewFile(option);
            }
        }
        
    }
    //预览文件回调函数版本1
    function testPreviewFileCallBackVersionOne(option) {
        try {
            var retObj = option;
            if (retObj.retCode < 0) {
                alert("错误信息：" + retObj.retMsg);
                return;
            }
            else {
                $("#previewFile_res").html("");
                var reshtml = "";              
                    reshtml += "<ul class='callbackData'>";
                    reshtml += "<li>ID：" + retObj.data.id + "</li>";                  
                    reshtml += "</ul>";
                    copyTextForFileId(retObj.data.id);
                    $("#previewFile_res").append(reshtml);               
            }
        } catch (err) {
            alert("回调错误，原因[" + err.message + "]");
            return;
        }
    }

    //预览文件回调函数版本2
    function testPreviewFileCallBackVersionTwo(option) {
        try {
            var retObj = option;
            if (retObj.retCode < 0) {
                alert("错误信息：" + retObj.retMsg);
                return;
            }
            else {             
                $("#previewFile_res").html("");
                var reshtml = "";
                for (var i = 0; i < retObj.data.length; i++) {
                    reshtml += "<ul class='callbackData'>";
                    reshtml += "<li>ID：" + retObj.data[i].id + "</li>"                     
                        + "<li>Source：" + retObj.data[i].source + "</li>";                
                    reshtml += "</ul>";
                }
                $("#previewFile_res").append(reshtml);
            }
        } catch (err) {
            alert("回调错误，原因[" + err.message + "]");
            return;
        }
    }
    
    /************************************删除文件**********************************************/
	function testDeleteFile() {
		var file_id = $("#Text1").val(); //文件ID
        if (!file_id) {
            alert("请录入文件ID");
			return;
        }
        //参数
        var option = {
            callback: "testDeleteFileCallBack",
            asyncData: "",
			id:file_id
        }
        MobileJS.deleteFile(option);
    }
    
    //删除文件回调函数
    function testDeleteFileCallBack(option) {
		try{
		    var retObj = option;
			if (retObj.retCode < 0) {
				alert("错误信息：" + retObj.retMsg);
				return;
			}
			else {
				if (retObj.data.id) {
					$("#delfile_imageid").html(retObj.data.id);
				}
			}
		}catch(err){
			alert("回调错误，原因["+err.message+"]");
			return;
		}
    }
	
	/************************************文件选择器**********************************************/
	function fileSelector(){
		var fileSelector_type = $("#fileSelector_type").val();//文件类型
		var fileSelector_maxCount = $("#fileSelector_maxCount").val(); //用户一事通ID或SAPID
		var fileSelector_version = $("#fileSelector_version").val(); //版本号
		if(!fileSelector_maxCount){
			fileSelector_maxCount = 0;
		}
		if (!fileSelector_version) {
		    fileSelector_version = "1";
		}
		//参数
		var option = {
		    version: fileSelector_version,
            callback: "fileSelectorCallBack",
            asyncData: "hello",
			type: fileSelector_type,
			maxCount:fileSelector_maxCount
        }
        MobileJS.fileSelector(option);
	}
	
	// 文件选择器回调
	function fileSelectorCallBack(option){
		var retObj = option;
        if (retObj.retCode < 0) {
            alert("错误信息：" + retObj.retMsg);
            return;
        }
        else {
            var ids = "";
			$("#fileSelector_res").html("");
			
			var reshtml = "";
            for(var i=0;i<retObj.data.length;i++){
				if(i==0){
					ids += retObj.data[i].id;
				} else {
					ids += "|" + retObj.data[i].id;
				}
				
                reshtml += "<ul class='callbackData'>";
                reshtml += "<li>ID："+retObj.data[i].id+"</li>"
					+"<li>FileName："+retObj.data[i].fileName+"</li>"
					+"<li>FileSize："+retObj.data[i].fileSize+"</li>"
					+ "<li>FileDate：" + retObj.data[i].fileDate + "</li>"
                    + "<li>Source：" + retObj.data[i].source + "</li>";
				if (retObj.data[i].thumbnail) {
					reshtml += "<li>Thumbnail：<img src=\"data:image/jpg;base64," + retObj.data[i].thumbnail + "\" width='50' height='50'/></li>";
				}
                if (retObj.data[i].userinfo) {
                    reshtml += "<li>UserInfo：" + retObj.data[i].userinfo + "</li>";
                }
                if(retObj.data[i].GPS) {
                    var gps = retObj.data[i].GPS
                    if (gps.latitude) {
                        reshtml += "<li>Latitude：" + gps.latitude + "</li>";
                    }
                    if (gps.longitude) {
                        reshtml += "<li>Longitude：" + gps.longitude + "</li>";
                    }
                }  
                if (retObj.data[i].address) {
                    reshtml += "<li>Address：" + retObj.data[i].address + "</li>";
                }
			    reshtml +="</ul>"
            }
            $("#fileSelector_res").append(reshtml);
            copyTextForFileId(ids);
        }
	}

    /************************************扫描二维码触发与回调函数**********************************************/
    function testGetCode() {
        var mode = $("#bar_mode").val(); //拍照模式
        //条形码参数
        var option = {
            callback: "testGetCodeCallBack",
            asyncData: "",
            mode: mode
        }
        MobileJS.getCode(option);
    }
    
    //扫描二维码回调函数
    function testGetCodeCallBack(option) {
		//var retObj = jQuery.parseJSON(option);
		var retObj = option;
        if (retObj.retCode < 0) {
            alert("错误信息：" + retObj.retMsg);
            return;
        }
        else {
            var resHtml = "";
            resHtml += "<ul class='callbackData'>";
            if (retObj.data.code) {
              //  alert(retObj.data.code);
                $("#code").html(retObj.data.code);
            } else if (retObj.data.name) {
              //  alert(retObj.data.name);
                resHtml += "<li>name：" + retObj.data.name + "</li>"
                 + "<li>sex：" + retObj.data.sex + "</li>"
                 + "<li>nation：" + retObj.data.nation + "</li>"
                 + "<li>year：" + retObj.data.year + "</li>"
                 + "<li>month：" + retObj.data.month + "</li>"
                 + "<li>day：" + retObj.data.day + "</li>"
                 + "<li>address：" + retObj.data.address + "</li>"
                 + "<li>id：" + retObj.data.id + "</li>"
                 + "<li>imgCardDetected：<img src=\"data:image/jpg;base64," + retObj.data.imgCardDetected + "\" width='200' height='150'/></li>"
                 + "<li>imgCardFace：<img src=\"data:image/jpg;base64," + retObj.data.imgCardFace + "\" width='50' height='50'/></li>"
                 + "<li>imgCardDetectedID：" + retObj.data.imgCardDetectedID + "</li>"
                 + "<li>imgCardFaceID：" + retObj.data.imgCardFaceID + "</li>";
                resHtml += "</ul>"
                $("#code").html(resHtml);
            } else if (retObj.data.authority) {
               // alert(retObj.data.name);
                resHtml += "<li>authority：" + retObj.data.authority + "</li>"
                    + "<li>validity：" + retObj.data.validity + "</li>"
                    + "<li>imgCardDetected：<img src=\"data:image/jpg;base64," + retObj.data.imgCardDetected + "\" width='200' height='150'/></li>"
                    + "<li>imgCardDetectedID：" + retObj.data.imgCardDetectedID + "</li>";
                resHtml += "</ul>"
                $("#code").html(resHtml);
            }
        }
    }

    /************************************扫描身份证触发与回调函数**********************************************/
    function testScanIDCard() {
        var maxSize = $("#scanIDCard_maxSize").val(); //图片最大大小
        //身份证参数
        var option = {
            asyncData: "",
            maxSize: maxSize,
            callback: function (param) {
                var retObj = param;
                if (retObj.retCode < 0) {
                    alert("错误信息：" + retObj.retMsg);
                    return;
                }
                else {
                    var resHtml = "";
                    resHtml += "<ul class='callbackData'>";
                    if (retObj.data.name) {
                        //  alert(retObj.data.name);
                        resHtml += "<li>name：" + retObj.data.name + "</li>"
                         + "<li>sex：" + retObj.data.sex + "</li>"
                         + "<li>nation：" + retObj.data.nation + "</li>"
                         + "<li>year：" + retObj.data.year + "</li>"
                         + "<li>month：" + retObj.data.month + "</li>"
                         + "<li>day：" + retObj.data.day + "</li>"
                         + "<li>address：" + retObj.data.address + "</li>"
                         + "<li>id：" + retObj.data.id + "</li>"
                         + "<li>imgCardDetected：<img src=\"data:image/jpg;base64," + retObj.data.imgCardDetected + "\" width='200' height='150'/></li>"
                         + "<li>imgCardFace：<img src=\"data:image/jpg;base64," + retObj.data.imgCardFace + "\" width='50' height='50'/></li>"
                         + "<li>imgCardDetectedID：" + retObj.data.imgCardDetectedID + "</li>"
                         + "<li>imgCardFaceID：" + retObj.data.imgCardFaceID + "</li>";
                        resHtml += "</ul>"
                        $("#scanIDCard_Result").html(resHtml);
                    } else if (retObj.data.authority) {
                        // alert(retObj.data.name);
                        resHtml += "<li>authority：" + retObj.data.authority + "</li>"
                            + "<li>validity：" + retObj.data.validity + "</li>"
                            + "<li>imgCardDetected：<img src=\"data:image/jpg;base64," + retObj.data.imgCardDetected + "\" width='200' height='150'/></li>"
                            + "<li>imgCardDetectedID：" + retObj.data.imgCardDetectedID + "</li>";
                        resHtml += "</ul>"
                        $("#scanIDCard_Result").html(resHtml);
                    }
                }
            }
        }
        MobileJS.scanIDCard(option);
    }


    /************************************人脸识别触发与回调函数**********************************************/
    function testFaceRecognition() {
        var cameraType = $("#faceRecognition_cameraType").val(); //前后摄像头
        var faceType = $("#faceRecognition_faceType").val(); //识别模式
        var keyNum = $("#faceRecognition_keyNum").val(); //关键数字
        //参数
        var option = {
            asyncData: "",
            cameraType: cameraType,
            faceType: faceType,
            keyNum: keyNum,
            callback: function (param) {
                var retObj = param;
                if (retObj.retCode < 0) {
                    alert("错误信息：" + retObj.retMsg);
                    return;
                }
                else {
                    var resHtml = "";
                    resHtml += "<ul class='callbackData'>";
                    if (retObj.data.faceImage) {
                        resHtml += "<li>faceImage：<img src=\"data:image/jpg;base64," + retObj.data.faceImage + "\" width='200' height='150'/></li>"
                        resHtml += "</ul>"
                        $("#faceRecognition_Result").html(resHtml);
                    } 
                }
            }
        }
        MobileJS.faceRecognition(option);
    }
/************************************获取GPS信息触发与回调函数**********************************************/
    //GPS模式切换
    function gpsChange(){
        var type = $("#getGpsInfo_Mode").val();
        if (type == "0") {
            $(".gps_address_tr").addClass("displayNone");
        } else if (type == "1") {
            $(".gps_address_tr").removeClass("displayNone");
        } else if (type == "2") {
            $(".gps_address_tr").removeClass("displayNone");
        }
    }

    function testGetGPSInfo() {
        var type = $("#getGpsInfo_Mode").val();
        //参数
        var option = {
            type: type,
            callback: "testGetGPSInfoCallBack",
            asyncData: ""
        }
        MobileJS.getGpsInfo(option);
    }

    //获取GPS信息回调函数
    function testGetGPSInfoCallBack(option) {
		var retObj = option;
        if (retObj.retCode < 0) {
            alert("错误信息：" + retObj.retMsg);
            return;
        }
        else {
            if (retObj.data.longitude) {
                $("#longitude").val(retObj.data.longitude);
            }
            if (retObj.data.latitude) {
                $("#latitude").val(retObj.data.latitude);
            }
            if (retObj.data.address) {
                $("#address").val(retObj.data.address);
            }
        }
    }

    /************************************获取位置信息触发与回调函数**********************************************/
    function testGetLocationInfo() {
        var level = $("#location_level").val();
        if (!level) {
            level = "18";
        }
        //参数
        var option = {
            callback: "testGetLocationInfoCallBack",
            asyncData: "",
            level:level
        }
        MobileJS.getLocationInfo(option);
    }

    //获取GPS信息回调函数
    function testGetLocationInfoCallBack(option) {
        var retObj = option;
        if (retObj.retCode < 0) {
            alert("错误信息：" + retObj.retMsg);
            return;
        }
        else {
            if (retObj.data.longitude) {
                $("#location_longitude").val(retObj.data.longitude);
            }
            if (retObj.data.latitude) {
                $("#location_latitude").val(retObj.data.latitude);
            }
            if (retObj.data.address) {
                $("#location_address").html(retObj.data.address);
            }
            if (retObj.data.snapshot) {
                $("#location_snapshot").html("<img src=\"data:image/jpg;base64," + retObj.data.snapshot + "\" width=\"500px\"  hight=\"500px\"/>");
            }
        }
    }
	
	/************************************访问本机通讯录与回调函数**********************************************/
    function testContactBook() {
		var maxsize = $("#contact_maxsize").val(); //选取数量限制
        if (!maxsize) {
            maxsize = 0;
        }
        //参数
        var option = {
            callback: "testContactBookCallBack",
            asyncData: "",
			max:maxsize
        }
        MobileJS.contactBook(option);
    }

    //访问本机通讯录回调函数
    function testContactBookCallBack(option) {
		//var retObj = jQuery.parseJSON(option);
		var retObj = option;
        if (retObj.retCode < 0) {
            alert("错误信息：" + retObj.retMsg);
            return;
        }
        else {
            if (retObj.data) {
                for(var i=0;i<retObj.data.length;i++){
					$("#contact_list").append("<span>"+retObj.data[i].name+"/"+retObj.data[i].phone+"</span>")
				}
            }
        }
    }
	
	/************************************设置是否自动锁屏**********************************************/
    function testSetIdleTimer() {
        var disable = false; //是否禁用自动锁屏
        if($('#disable').is(':checked')) {
            disable = true;
        }
        //参数
        var option = {
            callback: "",
            asyncData: "",
			disable:disable
        }
        MobileJS.setIdleTimer(option);
    }
	
	/************************************获取设备信息触发与回调函数**********************************************/
    function testGetDeviceInfo() {
        //参数
        var option = {
            callback: "testGetDeviceInfoCallBack",
            asyncData: ""
        }
        MobileJS.getDeviceInfo(option);
    }

    //获取设备信息回调函数
    function testGetDeviceInfoCallBack(option) {
		var retObj = option;
        if (retObj.retCode < 0) {
            alert("错误信息：" + retObj.retMsg);
            return;
        }
        else {
            if (retObj.data.osType) {
                $("#osType").val(retObj.data.osType);
            }
            if (retObj.data.osVersion) {
                $("#osVersion").val(retObj.data.osVersion);
            }
			if (retObj.data.appPublishVersion) {
                $("#appPublishVersion").val(retObj.data.appPublishVersion);
            }
			if (retObj.data.appBuildVersion) {
                $("#appBuildVersion").val(retObj.data.appBuildVersion);
            }
			if (retObj.data.deviceId) {
                $("#deviceId").val(retObj.data.deviceId);
            }
			if (retObj.data.deviceName) {
                $("#deviceName").val(retObj.data.deviceName);
            }
        }
    }
	
	/************************************退出应用**********************************************/
	//退出应用
	function testQuitSys(){
		//参数
        var option = {
            callback: "",
            asyncData: ""
        }
        if(confirm("是否退出本应用？")){
            MobileJS.quitSys(option);
        }
	}
	
	/************************************获取登陆用户信息触发与回调函数**********************************************/
    function testGetUserInfo() {
        //参数
        var option = {
            callback: "testGetUserInfoCallBack",
            asyncData: ""
        }
        MobileJS.getUserInfo(option);
    }

    //获取登陆用户信息回调函数
    function testGetUserInfoCallBack(option) {
		//var retObj = jQuery.parseJSON(option);
		var retObj = option;
        if (retObj.retCode < 0) {
            alert("错误信息：" + retObj.retMsg);
            return;
        }
        else {
            if (retObj.data.ystId) {
                $("#ystId").val(retObj.data.ystId);
            }
            if (retObj.data.sapId) {
                $("#sapId").val(retObj.data.sapId);
            }
			if (retObj.data.name) {
                $("#login_name").val(retObj.data.name);
            }
			if (retObj.data.orgId) {
                $("#login_orgId").val(retObj.data.orgId);
            }
			if (retObj.data.orgName) {
                $("#login_orgName").val(retObj.data.orgName);
            }
			if (retObj.data.pathId) {
                $("#login_pathId").val(retObj.data.pathId);
            }
			if (retObj.data.pathName) {
                $("#login_pathName").val(retObj.data.pathName);
            }
			if (retObj.data.emailId) {
                $("#login_emailId").val(retObj.data.emailId);
            }
			if (retObj.data.position) {
                $("#login_position").val(retObj.data.position);
            }
			if (retObj.data.mobile) {
                $("#login_mobile").val(retObj.data.mobile);
            }
			if (retObj.data.tel) {
                $("#login_tel").val(retObj.data.tel);
            }
			if (retObj.data.loginTime) {
                $("#loginTime").val(retObj.data.loginTime);
            }
			if (retObj.data.loginMode) {
                $("#loginMode").val(retObj.data.loginMode);
            }
			if (retObj.data.smallPhotoData) {
				$("#login_smallPhotoData").html("<img src=\"data:image/jpg;base64," + retObj.data.smallPhotoData + "\" width=\"50px\"  htight=\"50px\"/>");
			}
        }
    }
	
	/************************************访问地址本触发与回调函数**********************************************/
	
	function abChange(){
		var mode = $("#addressBook_Mode").val();//地址本模式
		if(mode=="dept"){
			$("#selectedData").val("");
		} else if(mode=="user"){
			$("#selectedData").val("");
		} else if(mode=="email"){
			$("#selectedData").val("");
		}
		//else if (mode == "hail") {
		//    var selDataStr = '[{HailNO:314567058,UserName:"顾玉华"},{HailNO:657373073,UserName:"李少华"}]'
		    
		//    $("#selectedData").val(selDataStr);
		//}
	}
	
	function testAddressBook(){
		var mode = $("#addressBook_Mode").val();//地址本模式
		//机构根节点
		var rootOrgId = $("#rootOrgId").val();
		if (!rootOrgId) {
            rootOrgId = "100001";
        }
		//机构根节点名称
		var rootOrgName = $("#rootOrgName").val();
		if (!rootOrgName) {
            rootOrgName = "招商银行";
        }
		//已选取的数据
		var selected = $("#selectedData").val();
		if (!selected) {
		    selected = jQuery.parseJSON("[]");
		} else {
		    selected = eval($("#selectedData").val());
		}
		
        
		//最大选取数量
		var maxCount = $("#maxCount").val();
		if(!maxCount){
			maxCount = 0;
		}
	
		//参数
        var option = {
            version: "1",
            callback: "testAddressBookCallBack",
            asyncData: "",
            mode: mode,
            rootOrgId: rootOrgId,
            rootOrgName: rootOrgName,
            selected: selected,
            maxCount: maxCount
        }
        MobileJS.addressBook(option);
	}
	
	//访问地址本回调函数
    function testAddressBookCallBack(option) {
		var retObj = option;
        if (retObj.retCode < 0) {
            alert("错误信息：" + retObj.retMsg);
            return;
        }
        else {
			var reshtml = "";
			var mode = $("#addressBook_Mode").val();//地址本模式
			if(mode=="dept"){
				alert("成功了--机构");
				for(var i=0;i<retObj.data.length;i++){
                    reshtml += "<ul class='callbackData'>";
                    reshtml += "<li>orgId："+retObj.data[i].orgId+"</li>"
                        +"<li>groupId："+retObj.data[i].groupId+"</li>"
					    +"<li>groupName："+retObj.data[i].groupName+"</li>"
					    +"<li>pathId："+retObj.data[i].pathId+"</li>"
					    +"<li>pathName："+retObj.data[i].pathName+"</li>";
			        reshtml +="</ul>"
                
//					$("#addressBook_res").append("<span>"+retObj.data[i].orgId
//						+"|"+retObj.data[i].groupId
//						+"|"+retObj.data[i].groupName
//						+"|"+retObj.data[i].pathId
//						+"|"+retObj.data[i].pathName+"</span>");
				}
			} else if(mode=="user"){
				alert("成功了--人员");
				for(var i=0;i<retObj.data.length;i++){
                    reshtml += "<ul class='callbackData'>";
                    reshtml += "<li>userId："+retObj.data[i].userId+"</li>"
                        +"<li>userName："+retObj.data[i].userName+"</li>"
					    +"<li>orgId："+retObj.data[i].orgId+"</li>"
					    +"<li>sapId："+retObj.data[i].sapId+"</li>"
					    +"<li>pathName："+retObj.data[i].pathName+"</li>"
					    +"<li>pathId："+retObj.data[i].pathId+"</li>"
					    +"<li>emailId："+retObj.data[i].emailId+"</li>"
					    +"<li>position："+retObj.data[i].position+"</li>";
			        reshtml +="</ul>"
			        
			        
//					$("#addressBook_res").append("<span>"+retObj.data[i].userId
//							+"|"+retObj.data[i].userName
//							+"|"+retObj.data[i].orgId
//							+"|"+retObj.data[i].sapId
//							+"|"+retObj.data[i].pathName
//							+"|"+retObj.data[i].pathId
//							+"|"+retObj.data[i].emailId
//							+"|"+retObj.data[i].position+"</span>");
				}
			} else if(mode=="email"){
				alert("成功了--邮件");
				for(var i=0;i<retObj.data.length;i++){
                    reshtml += "<ul class='callbackData'>";
                    reshtml += "<li>name："+retObj.data[i].name+"</li>"
                        +"<li>email："+retObj.data[i].email+"</li>";
			        reshtml +="</ul>"
//					$("#addressBook_res").append("<span>"+retObj.data[i].name+"|"
//					+retObj.data[i].email+"</span>")
				}
			} else if(mode=="hail"){
				alert("成功了--招呼");
				for(var i=0;i<retObj.data.length;i++){
                    reshtml += "<ul class='callbackData'>";
                    reshtml += "<li>HailNO："+retObj.data[i].HailNO+"</li>"
                        +"<li>UserName："+retObj.data[i].UserName+"</li>";
			        reshtml +="</ul>"
//					$("#addressBook_res").append("<span>"+retObj.data[i].HailNO+"|"
//					+retObj.data[i].UserName+"</span>")
				}
			} else if(mode=="hail_fwd"){
				alert("成功了--招呼转发");
				for(var i=0;i<retObj.data.length;i++){
                    reshtml += "<ul class='callbackData'>";
                    reshtml += "<li>FwdType："+retObj.data[i].FwdType+"</li>"
                        +"<li>FwdID："+retObj.data[i].FwdID+"</li>"
                        +"<li>FwdName："+retObj.data[i].FwdName+"</li>";
			        reshtml +="</ul>"
//					$("#addressBook_res").append("<span>"+retObj.data[i].FwdType
//					+"|"+retObj.data[i].FwdID
//					+"|"+retObj.data[i].FwdName+"</span>")
				}
			}
			$("#addressBook_res").html(reshtml);
        }
    }
	
	/************************************打开网页触发与回调函数**********************************************/
	function testOpenUrl(){
		var id = $("#openurl_id").val();//系统id
		if(!id){
			id="";
		}
        var webType = $("#openurl_webtype").val(); //集成登陆方式
		var title = $("#openurl_title").val();//标题
		if(!title){
			title="";
		}
		var url = $("#openurl_url").val();//请求url
		if(!url){
			url="";
		}
		//var webToolBar = $("#openurl_webtoolbar").val(); //是否显示底部工具栏
		var webNavBar = $("#openurl_navbar").val(); //是否显示顶部导航栏
		var weborientation = $("#openurl_orientation").val(); //是否限制屏幕方向
		
		//参数
        var option = {
            version: "1",
            callback: "testOpenUrlCallBack",
            asyncData: "",
            id: id,
            webType: webType,
            title: title,
            url: url,
			//webToolBar:webToolBar,
            webNavBar:webNavBar,
            webOrientation:weborientation
        }
        MobileJS.openUrl(option);
	}

	function testOpenUrlCallBack(option) {
	    var retObj = option;
	    if (retObj.retCode < 0) {
	        alert("错误信息：" + retObj.retMsg);
	        return;
	    }
	}
	
	/************************************验证手势密码触发与回调函数**********************************************/
	function testCheckGesturePwd(){
		//参数
        var option = {
            callback: "testCheckGesturePwdCallBack",
            asyncData: ""
        }
        MobileJS.checkGesturePwd(option);
	}
    
	function testCheckGesturePwdCallBack(option) {
	    var retObj = option;
	    if (retObj.retCode < 0) {
	        alert("错误信息：" + retObj.retMsg);
	        return;
	    } else {
	        alert(retObj.data.result);
	    }
	}

	/************************************锁定屏幕触发与回调函数**********************************************/
	function testLockScreen() {
	    //参数
	    var option = {
	        callback: "testLockScreenCallBack",
	        asyncData: ""
	    }
	    MobileJS.lockScreen(option);
	}

	function testLockScreenCallBack(option) {
	    var retObj = option;
	    if (retObj.retCode < 0) {
	        alert("错误信息：" + retObj.retMsg);
	        return;
	    } else {
	        alert(retObj.data.result);
	    }
	}
	
	/************************************隐藏显示导航栏**********************************************/
	function testNavHidden(){
		var animate = $("#id_animate").val(); //是否动画
		//参数
        var option = {
            callback: "",
            asyncData: "",
			hidden: "Y",
			animate: animate
        }
        MobileJS.navigationBar(option);
	}
	
	function testNavShow(){
		var animate = $("#id_animate").val(); //是否动画
		//参数
        var option = {
            callback: "",
            asyncData: "",
			hidden: "N",
			animate: animate
        }
        MobileJS.navigationBar(option);
	}


	/************************************隐藏显示水印**********************************************/
	function testWebWaterMarkHidden() {
	    //参数
	    var option = {
	        callback: "",
	        asyncData: "",
	        hidden: "Y"
	    }
	    MobileJS.webWaterMark(option);
	}

	function testWebWaterMarkShow() {
	    //参数
	    var option = {
	        callback: "",
	        asyncData: "",
	        hidden: "N"
	    }
	    MobileJS.webWaterMark(option);
	}
	/************************************发起招乎单聊**********************************************/
	function testSingleChat(){
		var singchat_id = $("#singchat_id").val(); //人员id
		if(!singchat_id){
			singchat_id = "";
		}
		//参数
        var option = {
            callback: "",
            asyncData: "",
			id: singchat_id
        }
        MobileJS.singleChat(option);
	}
	
	/************************************发起招乎群聊**********************************************/
	function testGroupChat() {
		var groupchat_id = $("#groupchat_id").val(); //群组id
		if(!groupchat_id){
			groupchat_id = "";
		}
		//参数
        var option = {
            callback: "",
            asyncData: "",
			groupId: groupchat_id
        }
        MobileJS.groupChat(option);
	}
	
	/************************************查看用户详情**********************************************/
	function testShowContactsUserInfo(){
		var showContactsUser_id = $("#showContactsUser_id").val(); //用户一事通ID或SAPID
		if(!showContactsUser_id){
			showContactsUser_id = "";
		}
		//参数
        var option = {
            callback: "",
            asyncData: "",
			id: showContactsUser_id
        }
        MobileJS.showContactsUserInfo(option);
	}

	/************************************调用录音**********************************************/
	function testaudioRecord() {
	    //参数
	    var option = {
	        callback: "testaudioRecordCallBack",
	        asyncData: ""
	    }
	    MobileJS.audioRecord(option);
	}

	function testaudioRecordCallBack(option) {
	    var retObj = option;
	    if (retObj.retCode < 0) {
	        alert("错误信息：" + retObj.retMsg);
	        return;
	    } else {
	        if (retObj.data.id) {
	            $("#audio_record_id").html(retObj.data.id);
	            copyTextForFileId(retObj.data.id);
	        }
	        if (retObj.data.fileSize) {
	            $("#audio_record_fileSize").html(retObj.data.fileSize);
	        }
	        if (retObj.data.fileName) {
	            $("#audio_record_fileName").html(retObj.data.fileName);
	        }
	    }
	}
	/************************************调用招呼视频播放接口**********************************************/
	function testZhVideo() {
	    var zhVideo_live_id = $("#zh_video_live_id").val(); //用户一事通ID或SAPID
	    if (!zhVideo_live_id) {
	        zhVideo_live_id = "";
	    }
	    var zhVideo_media_type = $("#zh_video_media_type").val(); //用户一事通ID或SAPID
	    if (!zhVideo_media_type) {
	        zhVideo_media_type = 0;
	    }
	    var zhVideo_token = $("#zh_video_token").val(); //用户一事通ID或SAPID
	    if (!zhVideo_token) {
	        zhVideo_token = "";
	    }
	    //参数
	    var option = {
	        callback: "testZhVideoCallBack",
	        liveId: zhVideo_live_id,
	        mediaType: zhVideo_media_type,
	        token: zhVideo_token,
	        asyncData: ""
	    }
	    MobileJS.openZHVideo(option);
	}

	function testZhVideoCallBack(option) {
	    var retObj = option;
	    if (retObj.retCode < 0) {
	        alert("错误信息：" + retObj.retMsg);
	        return;
	    } else {
	       
	    }
	}
	/************************************签名**********************************************/
	function testSignPicture() {
	    var imageUrl = $("#signPicture_url").val();
	    var left = $("#signPicture_left").val();
	    var top = $("#signPicture_top").val();
	    var right = $("#signPicture_right").val();
	    var bottom = $("#signPicture_bottom").val();
	    var maxSize = $("#signPicture_maxSize").val();
	    //参数
	    var option = {
	        callback: "testSignPictureCallBack",
	        asyncData: "",
	        originImageUrl: imageUrl,
	        left: left,
	        top: top,
	        right: right,
	        bottom: bottom,
            maxSize: maxSize
	    }
	    MobileJS.signPicture(option);
	}

	function testSignPictureCallBack(option) {
	    var retObj = option;
	    if (retObj.retCode < 0) {
	        alert("错误信息：" + retObj.retMsg);
	        return;
	    } else {
	        if (retObj.data.signedImage) {
	            $("#signPicture_image").html("<img src=\"data:image/jpg;base64," + retObj.data.signedImage + "\" width='100' height='100'/>&nbsp;");
	        }

	        if (retObj.data.id) {
	            $("#signPicture_image_id").html(retObj.data.id);
	            copyTextForFileId(retObj.data.id);
	        }
	    }
	}

	/************************************复制文件到剪贴板**********************************************/
	function copyText(){
		var copyText_text = $("#copyText_text").val();//待复制的文本
		//参数
        var option = {
            callback: "copyTextCallBack",
            asyncData: "",
			text: copyText_text
        }
        MobileJS.copyText(option);
	}
	
	function copyTextCallBack(option){
		var retObj = option;
        if (retObj.retCode < 0) {
            alert("错误信息：" + retObj.retMsg);
            return;
        }
        else {
			alert("复制成功,请使用下方的文本框测试");
		}
	}

	/************************************分享到微信**********************************************/
	//分享到微信信息
	function testShareToWeChat() {
	    var imageUrl = $("#shareToWeChat_imageUrl").val();
	    var title = $("#shareToWeChat_title").val();
	    var description = $("#shareToWeChat_description").val();
	    var url = $("#shareToWeChat_url").val();
	    var scene = $("#shareToWeChat_scene").val();
	    var option = {
	        callback: "testShareToWeChatCallBack",
	        asyncData: "",
	        imageUrl: imageUrl,
	        title: title,
	        description: description,
	        url: url,
            scene: scene
	    }
	    MobileJS.shareToWeChat(option);
	}
	//分享信息回调函数
	function testShareToWeChatCallBack(option) {
	    try {
	        var retObj = option;
	        if (retObj.retCode < 0) {
	            alert("错误信息：" + retObj.retMsg);
	            return;
	        }
	    } catch (err) {
	        alert("回调错误，原因[" + err.message + "]");
	        return;
	    }
	}

/***************************************************************/
	
	//拍完照，录完像之后直接复制id到剪贴板
	function copyTextForFileId(str){
		//参数
        var option = {
            callback: "copyTextForFileIdCallBack",
            asyncData: "",
			text: str
        }
        MobileJS.copyText(option);
	}
	function copyTextForFileIdCallBack(option){
		var retObj = option;
        if (retObj.retCode < 0) {
            alert("错误信息：" + retObj.retMsg);
            return;
        }
        else {
			alert("文件ID复制成功");
		}
	}

	/************************************自定义协议删除图片**********************************************/
	//获取缩略图
	function testThumbnailResFile() {
	    var fileId = $("#resFile_FileId").val();
	    var width = $("#resFile_thum_width").val();
	    var height = $("#resFile_thum_height").val();
	    $("#thumbnailResFile_img").attr({ src: "ystmo:///?schema=ImageThumbnail&id=" + fileId + "&width=" + width + "&height=" + height + "&t=" + Math.random() });
	}
    //压力测试批量获取缩略图
	function testThumbnailResFileTimes() {
	    var fileId = $("#resFile_FileId").val();
	    var width = $("#resFile_thum_width").val();
	    var height = $("#resFile_thum_height").val();
	    var times = parseInt($("#resFile_thum_times").val());
	    for (var i = 0; i < times; i++) {
	        var src = "ystmo:///?schema=ImageThumbnail&id=" + fileId + "&width=" + width + "&height=" + height + "&t=" + Math.random();
	        $("#thumbnailResFile_imgs").append("<img src=\"" + src + "\" />")
	    }
	}
	
    //获取原图
	function testOriginalResFile() {
	    var fileId = $("#resFile_FileId").val();
	    $("#originalResFile_img").attr({ src: "ystmo:///?schema=ImageOriginal&id=" + fileId + "&t=" + Math.random() });
	}

	//删除图片
	function testDeleteResFile() {
	    var fileId = $("#resFile_FileId").val();
		var img = new Image();
		img.src = "ystmo:///?schema=ImageDelete&id=" + fileId;
	}


	$(function(){
		$("#allCookie").append(document.cookie);
	});
	
	$(document).ready(function()
	{
		$('#idtext').click(function(e){ alert(1);$(this).focus(); });
		//$('#idbutton').bind("touchend", function () {
        //    $('#idfile').click();//trigger('click');
		//	return false;
        //});
		
		//window.webview.needFocus();
		//$('#idtext').click();
		//window.webview.softKeyBoardUp();
		
		//$('#idbutton').mousedown(function () {
        //    return false;
        //});
		$('#btn_cookie').click(function(e){
			$("#allCookie").html("");
			$("#allCookie").append(document.cookie);
		});
	});
	
	function idtextClick(){
		$('#idtext').click();
	}

//json对象序列化为字符串
	function obj2string(o) {
	    var r = [];
	    if (typeof o == "string") {
	        return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
	    }
	    if (typeof o == "object") {
	        if (!o.sort) {
	            for (var i in o) {
	                r.push(i + ":" + obj2string(o[i]));
	            }
	            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
	                r.push("toString:" + o.toString.toString());
	            }
	            r = "{" + r.join() + "}";
	        } else {
	            for (var i = 0; i < o.length; i++) {
	                r.push(obj2string(o[i]))
	            }
	            r = "[" + r.join() + "]";
	        } return r;
	    }
	    return o.toString();
	}

	
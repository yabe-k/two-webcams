function captureImage(video, w, h, top_or_bottom){
    const canvas = document.getElementById("picture")
    const soundFile = "./sound/sound2.mp3";
    const audio = new Audio(soundFile);
    audio.play();
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);

    colony = document.getElementById("colony-name-input").value;
    plate_num = document.getElementById("plate-number-input").value;

    if (colony == ""){
        alert("Colony name is not filled.");
        return;
    }
    if (plate_num == ""){
        alert("Plate number is not specified.");
        return;
    }
    var filename = String(colony) + "_" + String(plate_num) + "_" + top_or_bottom + "_" + getTime() + ".png";

    canvas.toBlob( blob =>{
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        console.log(filename);
        a.download = filename;
        a.click();

        URL.revokeObjectURL(a.href);
        
    },"image/png",1.0);

}

function getTime(){
    now = new Date();
    return now.getFullYear() + "-" + ("00" + String(Number(now.getMonth()) + 1)).slice(-2) + "-" + ("00" + now.getDate()).slice(-2) + "_" + ("00" + now.getHours()).slice(-2) + "-" + ("00" + now.getMinutes()).slice(-2)+ "-" + ("00" + now.getSeconds()).slice(-2)
}

async function playVideo(top_or_bottom){
    if(top_or_bottom == "top"){
        var video = video_top;
        var video_stream = video_stream_top;
        var select_camera_element_id = "select-camera_top";
    }else{
        var video = video_bottom;
        var video_stream = video_stream_bottom;
        var select_camera_element_id = "select-camera_bottom";
    }
    //const video = document.getElementById("video");
    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => {
        track.stop();
    });
    video.srcObject = null;

    var selectedId = document.getElementById(select_camera_element_id).value;
    //console.log(selectedId);
    video_stream = await navigator.mediaDevices.getUserMedia({
        video: {
            deviceId: selectedId,
            width: video_width,
            height: video_height,
        },
        audio: false,
    }).catch(e => {
        console.log(e);
    })
    video.srcObject = video_stream;
    video.play();
    canvas = document.getElementById("picture");
    canvas.width = video_width;
    canvas.height = video_height;
}

async function playVideo_and_getCamera(top_or_bottom){
    if(top_or_bottom == "top"){
        var video = video_top;
        var video_stream = video_stream_top;
        var select_camera_element_id = "select-camera_top";
    }else{
        var video = video_bottom;
        var video_stream = video_stream_bottom;
        var select_camera_element_id = "select-camera_bottom";
    }
    video_stream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: video_width,
            height: video_height,
        },
        audio: false,
    }).catch(e => {
      console.log(e)
    })
    video.srcObject = video_stream;
    video.play();
    navigator.mediaDevices.enumerateDevices()
        .then(
            function(devices){
                var select = document.getElementById(select_camera_element_id);
                devices.forEach(function(device) {
                    //console.log(device.kind, device.label);
                    var option = document.createElement("option");
                    option.text = device.label;
                    option.value = device.deviceId;
                    select.appendChild(option);
                });
            }
        ).catch(
            console.log("Failed to load the device list")
        ).finally(()=>{
            canvas = document.getElementById("picture");
            canvas.width = video_width;
            canvas.height = video_height;
        });
}
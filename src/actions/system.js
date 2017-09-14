import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const { execFile } = require('child_process');

export function createPersistenceToggle() {
  return { type: 'CreatePersistence_TOGGLE' }
}

export function setUsb(v) {
  return (dispatch, getState) => {
    dispatch({ type: 'Usb_SET', data: {fullName: v, path: v.split(" ").pop()} });
    if(v != " ") {
      let output = "";
      const device = v.split(" ").pop();
      const child = execFile('bootableusb', ["--partitions", device]);
      child.stdout.on('data', (data) => {
        output += data;
      });
      child.on('close', (code) => {
        let temp = output.split("\n");
        temp.pop();
        const grub = temp[0].split(" ");
        const data2 = temp[1].split(" ");
        
        dispatch({ type: 'Usb2_SET', data: { 
          usbGrubPart: grub[0],  
          usbGrubPath: grub[1],
          usbDataPart: data2[0],
          usbDataPath: data2[1]
        } });
        if(getState().system.usbGrubPart != "")
          dispatch(setMode("-"));
        else
          dispatch(setMode("mbr_bios-uefi"));
      });
    }
    else
      dispatch(setMode("mbr_bios-uefi"));
  }
}
export function setIso(v) {
  console.log(v);
  return { type: 'Iso_SET', data: {file: v, name: v.name} }
}
export function setMode(v) {
  return { type: 'Mode_SET', data: v }
}
export function setFilesystem(v) {
  return { type: 'Filesystem_SET', data: v }
}
export function setName(v) {
  return { type: 'Name_SET', data: v }
}


export function getDevices() {
  return (dispatch, getState) => {
    const child = execFile('bootableusb', ['--silent', '--listDevices']);
    child.stdout.on('data', (data) => {
      console.log(data);
      let arr = data.split('\n');
      arr.pop();
      dispatch({ type: 'UsbDevices_SET', data: arr });
      if(arr.length == 1)
        setUsb(arr[0])(dispatch, getState);
    });
    const child2 = execFile('which', ['kdesudo']);
    child2.stdout.on('data', (data) => {
      dispatch({ type: 'SudoCommand_SET', data: "kdesudo" });
    });
  }
}
export function burn(v) {
  return (dispatch, getState) => {
    const system = getState().system;
    const iso = system.isoFile.path;

    if(system.usbPath == "" || system.usbFullName == " ") {
      system.alertNode.error('Lütfen aygıt seçin.');
      return {};
    }

    if(system.mode == "direct") {
      if(iso == "" || iso == undefined) {
        system.alertNode.error('Lütfen iso dosyasını seçin.');
        return {};
      }
      console.log('dd bs=4M if='+iso+' of='+getState().system.usbPath+' status=progress && sync');
      exec('dd bs=4M if='+iso+' of='+getState().system.usbPath+' status=progress && sync', null, true)(dispatch, getState);
      return {};
    }
    else if(system.mode == "-") {
      if(system.usbDataPath == "") {
        system.alertNode.error('Lütfen aygıtı bağlayın.');
        return {};
      }
      if(iso == "" || iso == undefined) {
        system.alertNode.error('Lütfen iso dosyasını seçin.');
        return {};
      }
      exec(["rsync", "-rlt", "--info=progress2", iso, system.usbDataPath+"/bootableusb/linux/"])(dispatch, getState);
    }
    else {
      let config = {};
       switch(system.mode) {
        case "":
        case " ":
        case "mbr_bios-uefi":
          config.type = "all";
          config.scheme = "mbr";
          break;
        case "gpt_uefi":
          config.type = "uefi";
          config.scheme = "gpt";
          break;
        case "hybrid":
          config.type = "all";
          config.scheme = "hybrid";
          break;
      }
      if(iso == "" || iso == undefined)
        exec(['bootableusb', '--silent', '--name', system.name, '--type', config.type, '--scheme', config.scheme, '--install', getState().system.usbPath], null, true)(dispatch, getState);
      else
        exec(['bootableusb', '--silent', '--name', system.name, '--type', config.type, '--scheme', config.scheme, '--full', iso, getState().system.usbPath], null, true)(dispatch, getState);
        
    }

  };
}

function alert(node, message, type) {
  let state2 = node.state.alerts;
  if(type=="info")
    state2[0].icon = <CircularProgress />;
  else
    state2[0].icon = null;
  
  if(type=="error")
    state2[0].message = <div><p>{message}</p><p>{state2[0].message}</p></div>;
  else
    state2[0].message = message;

  state2[0].type = type;
  node.setState({alerts: state2});
}

function exec(command, func, root=false) {
  return (dispatch, getState) => {
    const system = getState().system;

    dispatch({ type: 'Loading_TOGGLE' });
    system.alertNode.show("İşleminiz gerçekleştiriliyor...",{time: 0});

    let child = null; 
    if(root) {
      if(!Array.isArray(command))
        command = ["sh", "-c", command];
      child = execFile(system.sudoCommand, command);
    }
    else {
      let temp = "";
      if(Array.isArray(command)) {
        temp = command.shift();
        child = execFile(temp, command);
      }
      else
        child = execFile("sh", ["-c", command]);
    }

    child.stdout.on('data', (data) => {
      alert(system.alertNode, data, "info");
    });

    child.stderr.on('data', (data) => {
      alert(system.alertNode, data, "info");
    });

    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      if(code==0) {
        alert(system.alertNode, "İşlem başarıyla gerçekleşti.", "success");
        if(func)
          func();
      }
      else
        alert(system.alertNode, "Hatayla karşılaşıldı.", "error");

      dispatch({ type: 'Loading_TOGGLE' });
    });
  }
}
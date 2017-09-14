function lang() {
  let langFile = {
    tr: require('../../po/tr.po')
  }
  let gettextParser = require("gettext-parser");
  
  let lang = process.env.LANGUAGE;
  if(langFile[lang])
    return gettextParser.po.parse(langFile[lang]).translations[''];
  else
    return {};
}

export function system(state = {
  usbDevices: [],
  usbFullName: " ",
  usbPath: "",
  usbGrubPart: "",
  usbGrubPath: "",
  usbDataPart: "",
  usbDataPath: "",
  mode: " ",
  filesystem: " ",
  name: "",
  isoFile: "",
  isoName: "",
  createPersistence: false,
  alertNode: false,
  loading: false,
  sudoCommand: "pkexec",
  po: lang()
}, action) {
  switch (action.type) {
    case 'CreatePersistence_TOGGLE':
      return Object.assign({}, state, {
        createPersistence: !state.createPersistence
      });
    case 'Loading_TOGGLE':
      return Object.assign({}, state, {
        loading: !state.loading
      });
    case 'SudoCommand_SET':
      return Object.assign({}, state, {
        sudoCommand: action.data
      });
    case 'UsbDevices_SET':
      return Object.assign({}, state, {
        usbDevices: action.data
      });
    case 'Usb_SET':
      return Object.assign({}, state, {
        usbFullName: action.data.fullName,
        usbPath: action.data.path,
        usbGrubPart: "",
        usbGrubPath: "",
        usbDataPart: "",
        usbDataPath: "",
      });
    case 'Usb2_SET':
      return Object.assign({}, state, {
        usbGrubPart: action.data.usbGrubPart,
        usbGrubPath: action.data.usbGrubPath,
        usbDataPart: action.data.usbDataPart,
        usbDataPath: action.data.usbDataPath,
      });
    case 'Mode_SET':
      return Object.assign({}, state, {
        mode: action.data,
      });
    case 'Filesystem_SET':
      return Object.assign({}, state, {
        filesystem: action.data,
      });
    case 'Name_SET':
      return Object.assign({}, state, {
        name: action.data,
      });
    case 'Iso_SET':
      return Object.assign({}, state, {
        isoFile: action.data.file,
        isoName: action.data.name,
      });
    case 'Alert_SET':
      return Object.assign({}, state, {
        alertNode: action.data,
      });
    default:
      return state;
  }
}
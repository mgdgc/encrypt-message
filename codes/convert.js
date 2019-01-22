const startTag = "<msg>";
const endTag = "</end>";

var cbShowPW = document.getElementById("cb_show_pw");
var cbStrictMode = document.getElementById("cb_strict_mode");
var cbShowLog = document.getElementById("cb_show_log");
var txtInput = document.getElementById("input_message");
var txtOutput = document.getElementById("output_message");
var txtPassword = document.getElementById("password");
var txtLog = document.getElementById("output_log");
var btnConvert = document.getElementById("btn_convert");
var btnHelp = document.getElementById("btn_help");

var popupLayout = document.getElementById("div_popup");
var popupTitle = document.getElementById("popup_title");
var popupMessage = document.getElementById("popup_message");
var popupClose = document.getElementById("popup_close");
var popupBg = document.getElementById("div_popup_bg");

var helpLayout = document.getElementById("div_help");
var helpClose = document.getElementById("p_help_close");

var logs = new Array();

btnConvert.addEventListener("click", function () {
	logs = new Array();
	txtLog.value = "";
	if (checkValid()) {
		var encryptMode = checkConvertMode();
		switch (encryptMode) {
			case 0: // 복호화 모드
				var decryptedMsg = decrypt(true);
				var outputMsg = decryptedMsg.substring(
					(decryptedMsg.indexOf(startTag) +
						startTag.length), decryptedMsg.indexOf(endTag));

				logs.push("password: " + txtPassword.value);
				txtOutput.value = outputMsg;
				break;

			case 1: // 암호화 모드
				if (cbStrictMode.checked) {
					if (checkStrictPassword()) {
						var encryptedMsg = encrypt();
						logs.push("password: " + txtPassword.value);

						txtOutput.value = encryptedMsg;
					} else {
						logs.push("encrypt failed: password error\nerror message \"엄격모드에서 비밀번호는 8자리 이상이며,  영문자(소문자, 대문자), 숫자, 특수부호를 모두 포함해야 합니다.\"");
					}
				} else {
					var encryptedMsg = encrypt();
					logs.push("password: " + txtPassword.value);
					txtOutput.value = encryptedMsg;
				}
				break;

			case 2: // 복호화 중 데이터 손상을 감지한 경우
				showPopupMessage("데이터 손상 감지", "데이터를 검사하던 중 데이터가 온전하지 않은 것을 발견했습니다. 보안을 위해 데이터를 복구하지 않았습니다. 올바른 데이터로 다시 시도해 주십시오.");
				logs.push("password: " + txtPassword.value, "input:" + txtInput.value);
				txtOutput.value = "데이터가 손상되어 복호화를 진행하지 않았습니다.\n\n결과 로그를 참조해 주십시오."
				break;
		}
		setLogData();
	}
});

btnHelp.addEventListener("click", function () {
	helpLayout.hidden = false;
});

helpClose.addEventListener("click", function () {
	helpLayout.hidden = true;
});

popupClose.addEventListener("click", function () {
	popupLayout.hidden = true;
	popupBg.hidden = true;
});

cbShowPW.addEventListener("change", function () {
	if (this.checked) {
		txtPassword.type = "text";
	} else {
		txtPassword.type = "password";
	}
});

cbShowLog.addEventListener("change", function () {
	if (this.checked) {
		txtLog.hidden = false;
	} else {
		txtLog.hidden = true;
	}
});

cbStrictMode.addEventListener("change", function () {
	if (txtPassword.value.length != 0) {
		if (this.checked) {
			logs.push("strict mode: true");
			checkStrictPassword();
		}
	}
});

function checkValid() {
	if (txtInput.value == "") {
		showPopupMessage("빈 항목", "암호화 할 메시지를 입력해 주세요.");
		return false;
	} else {
		if (txtPassword.value == "") {
			var confirmWindow = confirm("비밀번호를 입력하지 않았습니다.\n\n임의의 비밀번호를 생성할까요?");
			if (confirmWindow) {
				txtPassword.value = buildPW();
				logs.push("password generated: true");
			} else {
				return false;
			}
		}
	}
	return true;
}

function checkStrictPassword() {
	var validate = {
		small: false,
		capital: false,
		number: false,
		symbol: false
	}

	var password = txtPassword.value;
	if (password.length < 8) {
		showPopupMessage("엄격 모드", "8자 이상의 비밀번호를 입력하십시오.");
		return false;
	}

	for (var i = 0; i < password.length; i++) {
		var p = password[i];
		if (p >= 'A' && p <= 'Z') {
			validate.capital = true;
		} else if (p >= 'a' && p <= 'z') {
			validate.small = true;
		} else if ((p >= '!' && p <= '/') ||
			(p >= '{' && p <= '~')) {
			validate.symbol = true;
		} else if (p >= '0' && p <= '9') {
			validate.number = true;
		}
	}
	if (validate.small) {
		logs.push("password includes: small letters");
		if (validate.capital) {
			logs.push("password includes: capital letters");
			if (validate.symbol) {
				logs.push("password includes: symbols");
				if (validate.number) {
					logs.push("password includes: numbers");
					return true;
				}
			}
		}
	}
	showPopupMessage("엄격 모드", "엄격모드에서 비밀번호는 영문자(소문자, 대문자), 숫자, 특수부호를 모두 포함해야 합니다.");
	return false;
}

function checkConvertMode() {
	var converted = decrypt(false);
	if (converted.startsWith(startTag) || converted.endsWith(endTag)) {
		logs.push("mode: decrypt");
		if (converted.startsWith(startTag) && converted.endsWith(endTag)) {
			logs.push("distorted: false");
			return 0;
		} else {
			logs.push("distorted: true");
			return 2;
		}
	} else {
		logs.push("mode: encrypt");
		logs.push("distorted: false");
		return 1;
	}
}

function buildPW() {
	var pw = "";
	for (var i = 0; i < 12; i++) {
		var ranNum = Math.floor(Math.random() * 'z'.charCodeAt(0));
		var word = String.fromCharCode(ranNum);
		pw += word;
	}
	return pw;
}

function encrypt() {
	var message = startTag + txtInput.value + endTag;
	var rawCode = "";
	var password = txtPassword.value;
	var converted = "";
	var indexOfPw = 0;
	for (var i = 0; i < message.length; i++) {
		if (indexOfPw >= password.length) {
			indexOfPw = 0;
		}
		var encryptedUnicode = (message[i].charCodeAt(0) + password[indexOfPw].charCodeAt(0));
		rawCode += encryptedUnicode + " ";
		converted += String.fromCharCode(encryptedUnicode);
		indexOfPw++;
	}
	logs.push("rawCode: " + rawCode);
	return converted;
}

function decrypt(printLog) {
	var message = txtInput.value;
	var password = txtPassword.value;
	var rawCode = "";
	var converted = "";
	var indexOfPw = 0;
	for (var i = 0; i < message.length; i++) {
		if (indexOfPw >= password.length) {
			indexOfPw = 0;
		}
		var encryptedUnicode = (message[i].charCodeAt(0) - password[indexOfPw].charCodeAt(0));
		rawCode += encryptedUnicode + " ";
		converted += String.fromCharCode(encryptedUnicode);
		indexOfPw++;
	}
	if (printLog) {
		logs.push("rawCode: " + rawCode);
	}
	return converted;
}

function setLogData() {
	var log = "";
	for (var i = 0; i < logs.length; i++) {
		log += logs[i] + "\n";
	}
	txtLog.value = log;
}

function showPopupMessage(title, message) {
	popupBg.hidden = false;
	popupLayout.hidden = false;
	popupLayout.width = (document.width / 5) * 4;
	popupTitle.textContent = title;
	popupMessage.textContent = message;
}

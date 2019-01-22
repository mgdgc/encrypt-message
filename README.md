# 암호 메시지

1학년 1학기 기초프로그래밍 기말 프로젝트

## 배경 및 동기

암호 메시지는 사용자로부터 입력 받은 메시지의 본문을 암호화하여 제공합니다. 
암호화된 메시지를 받은 사용자가 동일한 비밀번호를 가지고 메시지를 복호화 하면, 송신자가 보내려고 한 메시지를 볼 수 있습니다. 
암호 메시지는 사용자로 하여금 메시지를 암호화 및 복호화 하도록 하여 한 단계 더 높은 보안을 제공하는 것이 목표입니다.

## 기능

1. 메시지 암호화 및 복호화

   > 사용자가 입력한 비밀번호를 기반으로 유니코드 로 디코딩 된 메시지를 암호화합니다. 암호화된 메시지는 다시 유니코드로 인코딩 되어 결과창에 표시됩니다. 
   > 입력된 메시지가 이미 암호화된 메시지인지 아닌지를 판별하여 자동으로 암호화 모드와 복호화 모드로 전환합니다.

2. 데이터 손상 감지

   > 암호화된 메시지를 전송하는 도중에 데이터가 손상되었는지 아닌지를 판별하여 사용자에게 제공합니다. 메시지가 손상된 경우에는 복호화를 진행하지 않습니다. 

3. 엄격 모드

   > 보안성을 높이기 위해 사용자로 하여금 예측 가능한 비밀번호를 사용하지 못하도록 영문자(소문자, 대문자), 숫자, 특수문자를 사용하여 어려운 비밀번호를 사용하도록 유도하는 기능입니다.

4. 자동 비밀번호 생성

   > 비밀번호를 입력하지 않았을 경우 임의의 비밀번호를 생성할 수 있는 옵션을 제공합니다. 최대 12자리 숫자로 자동 생성됩니다.



## 구현 내용

   [구현 내용 보기](/code_explanation.md)

## 실행 결과

   > 시작 화면, 메인 화면, 도움말
   
   <p>
      <img src="/screenshots/screenshot_26.png" alt="Welcome screen" width="250px">
      <img src="/screenshots/screenshot_27.png" alt="Main screen" width="250px">
      <img src="/screenshots/screenshot_28.png" alt="Help screen" width="250px">
   </p>
   
   
   > 암호화, 복호화 화면
   
   <p>
      <img src="/screenshots/screenshot_29.png" alt="Sample shot of encrypting" width="250px">
      <img src="/screenshots/screenshot_30.png" alt="Sample shot of decrypting" width="250px">
   </p>
   
   > 데이터 손상 시
   
   <p>
      <img src="/screenshots/screenshot_31.png" alt="Sample shot of error 1" width="250px">
      <img src="/screenshots/screenshot_32.png" alt="Sample shot of error 2" width="250px">
   </p>
   
   > 결과 로그
   
   <p>
      <img src="/screenshots/screenshot_33.png" alt="Convert log" width="250px">
   </p>



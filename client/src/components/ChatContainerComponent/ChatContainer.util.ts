const minuteToMilisecond = 60000;

export function formatDateBetweenMsg(
  previousMsgDate: string | null,
  currentMsgDate: string
) {
  let currentMsgDateObj = new Date(currentMsgDate);
  let dateNow = new Date(Date.now());

  let currentMsgDateStr = currentMsgDateObj.toDateString().split(" ");
  let { minute, hours } = {
    minute: currentMsgDateObj.getMinutes(),
    hours: currentMsgDateObj.getHours(),
  };
  let minutes = minute < 10 ? "0" + minute : minute;
  switch (true) {
    // Handle case consecutive messages (ex: trong 20 phút nhắn tin , 
    // chỉ message đầu là hiện time , còn lại KO hiện, nếu msg mới đc gửi ở phút thứ 21 thì hiện time)
    case previousMsgDate &&
      currentMsgDateObj.getTime() - new Date(previousMsgDate).getTime() <
        minuteToMilisecond * 20:
      return null;

    // Handle case different year 
    case currentMsgDateObj.getFullYear() !== dateNow.getFullYear():
      return `${currentMsgDateStr[1]} ${currentMsgDateStr[2]}, ${currentMsgDateStr[3]}, ${hours}:${minutes}`;

    // Handle case different month and week
    case currentMsgDateObj.getMonth() !== dateNow.getMonth():
    case dateNow.getDate() - currentMsgDateObj.getDate() > 6:
    case currentMsgDateObj.getDay() > dateNow.getDay():
      return `${currentMsgDateStr[1]} ${currentMsgDateStr[2]}, ${hours}:${minutes}`;

    // Handle case same day (ex: 15:30)
    case currentMsgDateObj.getDate() === dateNow.getDate():
      return `${hours}:${minutes}`;

    // Handle case same week 
    default:
      return `${currentMsgDateStr[0]}, ${hours}:${minutes}`;
  }
}

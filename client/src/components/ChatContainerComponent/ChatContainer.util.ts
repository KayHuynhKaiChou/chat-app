const minuteToMilisecond = 60000;

/**
 * Formats the date between messages based on the time difference and context.
 * 
 * This function determines whether a timestamp should be displayed between
 * consecutive messages in a chat interface, based on various conditions:
 * 
 * - If the time difference between the current and previous message is
 *   less than 20 minutes, it returns null, indicating that no timestamp
 *   should be shown.
 * - If the messages are from different years, it returns a string in
 *   the format: "Month Day, Year, HH:MM".
 * - If the messages are from different months, weeks, or days of the week,
 *   it returns a string in the format: "Month Day, HH:MM".
 * - If the messages are from the same day, it returns a string in the
 *   format: "HH:MM".
 * - If the messages are from the same week, it returns a string in the
 *   format: "Day, HH:MM".
 * 
 * @param previousMsgDate - The timestamp of the previous message, or null if
 *                          there is no previous message.
 * @param currentMsgDate - The timestamp of the current message.
 * @returns A formatted date string or null if no timestamp should be shown.
 */

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

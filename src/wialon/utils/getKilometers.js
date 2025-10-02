
import MessagesService from "./getMessages.js";
import timestamp from "./timestamp.js";

const now = new Date();
const endDate = new Date(now);
endDate.setHours(23, 59, 0, 0);
const startDate = new Date(now);
startDate.setDate(startDate.getDate() - 7);
startDate.setHours(0, 0, 0, 0);

const startDateStr = timestamp.formatLocalDate(startDate);
const endDateStr = timestamp.formatLocalDate(endDate);

$( () => {
 (async () => {
     console.log(startDateStr);
     console.log(endDateStr);
     console.log(timestamp.toUnixTimestamp(startDateStr));
     console.log(timestamp.toUnixTimestamp(endDateStr));

     await getMessagesByWeek(
         timestamp.toUnixTimestamp(startDateStr),
         timestamp.toUnixTimestamp(endDateStr)
     );
 })();
});

const getMessagesByWeek = async (_from, _to) => {
 const messageService = new MessagesService(_from, _to);
 const unit_messages = await messageService.loadMessagesToday("28776132");
 console.log(unit_messages);
 return unit_messages;
};

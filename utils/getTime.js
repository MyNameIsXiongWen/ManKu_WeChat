function getTime(start, end) {
  start = start.replace(/\-/g, "/")
  end = end.replace(/\-/g, "/")
  var sDate = new Date(start)
  var eDate = new Date(end)
  var diff = eDate - sDate;//毫秒
  var h = parseInt(diff / 1000 / 60 / 60);
  var m = parseInt((diff - h * 1000 * 60 * 60) / 1000 / 60)
  var s = parseInt((diff - h * 1000 * 60 * 60 - m*1000*60) / 1000)
  return [h < 10 ? '0' + h : h, m < 10 ? '0' + m : m, s<10?'0'+s : s]
}
function timeFormatter(time) {
  var date = time.replace(/\-/g, "/")
  var dddDate = new Date(date).getTime() + 1000;
  var newDate = new Date(dddDate)
  var currentdate = newDate.getFullYear() + "/" +
    (newDate.getMonth() + 1) + "/" +
    newDate.getDate() + " " +
    newDate.getHours() + ":" +
    newDate.getMinutes() + ":" +
    newDate.getSeconds();
  return currentdate;
}
module.exports = {
  getTime,
  timeFormatter
}
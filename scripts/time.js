export const tim = () => {
  let years = new Date().getFullYear();
  let months = new Date().getMonth() + 1;
  let days = new Date().getDate();
  let hours = new Date().getHours();
  let minutes = new Date().getMinutes();
  let seconds = new Date().getSeconds();
  let displayHours = hours > 12 ? hours - 12 : hours;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (days < 10) {
    days = `0${days}`;
  }
  if (months < 10) {
    months = `0${months}`;
  }
  if (hours === 0) {
    displayHours = 12;
  }
  document.getElementById("year").innerText = `${months}/${days}/${years}`;
  document.getElementById(
    "tim"
  ).innerHTML = `${displayHours}<span id = 'blink'>:</span>${minutes}<span id = 'blink'>:</span>${seconds}${
    hours > 12 ? "PM" : "AM"
  }`;
};

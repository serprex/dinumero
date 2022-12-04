let audio = null;
function beep(duration, frequency, volume, type, callback) {
	const oscillator = audio.createOscillator();
	const gainNode = audio.createGain();
	oscillator.connect(gainNode);
	gainNode.connect(audio.destination);

	if (volume) {
		gainNode.gain.value = volume;
	}
	if (frequency) {
		oscillator.frequency.value = frequency;
	}
	if (type) {
		oscillator.type = type;
	}
	if (callback) {
		oscillator.onended = callback;
	}

	oscillator.start(audio.currentTime);
	oscillator.stop(audio.currentTime + duration);
}

const countput = document.getElementById("count");
const startbtn = document.getElementById("start");
const promptdiv = document.getElementById("prompt");
let actualCount = 0;
const pending = [];
startbtn.addEventListener("click", function (e) {
	if (this.value === "Start") {
		audio ||= new AudioContext();
		actualCount = 0;
		for (let i = 0; i < 30000; i += 300 + Math.random() * 1000) {
			pending.push(
				setTimeout(() => {
					console.log("beep");
					beep(200, 300, 1.0, "sine");
				}, i)
			);
		}
		pending.push(
			setTimeout(() => {
				promptdiv.textContent = "How many beeps?";
				this.value = "Guess";
			}, 31000 + audio.outputLatency * 1000)
		);
		this.value = "Stop";
	} else if (this.value === "Guess") {
		const guess = countput.value | 0;
		promptdiv.textContent = `Guess: ${countput.value}. Actual value: ${actualCount}`;
		this.value = "Start";
	} else if (this.value === "Stop") {
		for (const timer of pending) {
			clearTimeout(timer);
		}
		pending.length = 0;
		this.value = "Start";
	}
});

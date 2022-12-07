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

const freqput = document.getElementById("freqs");
const countsdiv = document.getElementById("counts");
const startbtn = document.getElementById("start");
const promptdiv = document.getElementById("prompt");
let actualCounts = [],
	freqCount = 0;
const pending = [];
startbtn.addEventListener("click", function (e) {
	if (this.value === "Start") {
		while (countsdiv.lastChild) countsdiv.removeChild(countsdiv.lastChild);
		audio ||= new AudioContext();
		actualCounts.length = 0;
		freqCount = freqput.value;
		const taken = new Set();
		for (let f = 0; f < freqCount; f++) {
			let actualCount = 0;
			for (
				let i = 0;
				i < 30000;
				i += Math.random() * Math.random() * 2000 * freqCount
			) {
				if (taken.has(i)) continue;
				for (let j = i - 40; j < i + 40; j++) {
					taken.add(j);
				}
				actualCount++;
				pending.push(
					setTimeout(
						() => beep(0.06, 360 + (720 / freqCount) * f, 1.0, "sine"),
						i
					)
				);
			}
			actualCounts.push(actualCount);
		}
		pending.push(
			setTimeout(() => {
				promptdiv.textContent = "How many beeps?";
				for (let i = 0; i < freqCount; i++) {
					const countpush = document.createElement("input");
					countpush.type = "button";
					countpush.value = "Beep";
					countpush.onclick = () => beep(0.06, 240 + 80 * i, 1.0, "sine");
					const count = document.createElement("input");
					count.type = "input";
					countsdiv.appendChild(countpush);
					countsdiv.appendChild(count);
					countsdiv.appendChild(document.createElement("br"));
				}
				this.value = "Guess";
			}, 31000 + audio.outputLatency * 1000)
		);
		this.value = "Stop";
	} else if (this.value === "Guess") {
		promptdiv.textContent = `Actual counts: ${actualCounts.join(", ")}`;
		this.value = "Start";
	} else if (this.value === "Stop") {
		for (const timer of pending) {
			clearTimeout(timer);
		}
		pending.length = 0;
		this.value = "Start";
	}
});

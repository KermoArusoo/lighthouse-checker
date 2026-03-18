// Get DOM elements
const form = document.getElementById("form");
const apiInput = document.getElementById("api-input");
const urlInput = document.getElementById("url-input");
const strategyDesktop = document.getElementById("desktop");
const strategyMobile = document.getElementById("mobile");
const loadingDiv = document.getElementById("loading");
const submitButton = document.getElementById("submit-button");
const errorsDiv = document.getElementById("errors");
const resultsDiv = document.getElementById("results");
const performanceScore = document.getElementById("score-performance");
const accessibilityScore = document.getElementById("score-accessibility");
const bestPracticesScore = document.getElementById("score-best-practices");
const seoScore = document.getElementById("score-seo");

form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const apiKey = apiInput.value;
	const url = urlInput.value;
	const strategy = strategyDesktop.checked ? "desktop" : "mobile";
	await analyzeUrl(apiKey, url, strategy);
});

async function analyzeUrl(apiKey, url, strategy) {
	try {
		showElement(loadingDiv);
		submitButton.disabled = true;
		errorsDiv.classList.add("hidden");
		resultsDiv.classList.add("hidden");

		url = url.trim();

		if (!url.startsWith("http://") && !url.startsWith("https://")) {
			url = "https://" + url;
		}

		const encodedUrl = encodeURIComponent(url);
		const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&strategy=${strategy}&key=${apiKey}&category=performance&category=accessibility&category=best-practices&category=seo`;
		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error(
				`API request failed. Check that your API key and URL are correct.`,
			);
		}

		const data = await response.json();
		const scores = {
			performance: Math.round(
				data.lighthouseResult.categories.performance.score * 100,
			),
			accessibility: Math.round(
				data.lighthouseResult.categories.accessibility.score * 100,
			),
			bestPractices: Math.round(
				data.lighthouseResult.categories["best-practices"].score * 100,
			),
			seo: Math.round(data.lighthouseResult.categories.seo.score * 100),
		};

		displayScore(performanceScore, scores.performance);
		displayScore(accessibilityScore, scores.accessibility);
		displayScore(bestPracticesScore, scores.bestPractices);
		displayScore(seoScore, scores.seo);

		loadingDiv.classList.add("hidden");
		showElement(resultsDiv);
		submitButton.disabled = false;
	} catch (error) {
		loadingDiv.classList.add("hidden");
		submitButton.disabled = false;
		showElement(errorsDiv);
		errorsDiv.textContent = error.message;
	}
}

function getScoreClass(score) {
	if (score >= 90) return "score-good";
	if (score >= 50) return "score-average";
	return "score-poor";
}

function displayScore(element, score) {
	element.textContent = score;
	element.classList.remove("score-good", "score-average", "score-poor");
	element.classList.add(getScoreClass(score));
}

function showElement(element) {
	element.classList.remove("hidden", "fade-in");

	void element.offsetWidth;
	element.classList.remove("hidden");
	element.classList.add("fade-in");
}

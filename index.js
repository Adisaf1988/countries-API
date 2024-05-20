function init() {
    const button = document.querySelector("#getCountries");
    button.addEventListener("click", async () => {
        try {
            const result = await fetch("https://restcountries.com/v3.1/all");
            const data = await result.json();

            const currencyAggregation = data.reduce((currencyAgg, current) => {
                if (!current?.currencies) return currencyAgg;
                const currencies = Object.keys(current?.currencies);
                if (!Array.isArray(currencies)) return currencyAgg;
                currencies.forEach(currencyKey => {
                    if (currencyAgg[currencyKey]) {
                        currencyAgg[currencyKey] = currencyAgg[currencyKey] + 1;
                    } else {
                        currencyAgg[currencyKey] = 1;
                    }
                });
                return currencyAgg;
            }, {});

            console.log(currencyAggregation);
            const over5Countries = Object.entries(currencyAggregation).filter(([key, value]) => {
                return value > 5;
            });

            const languagesAggregation = data.reduce((languagesAgg, current) => {
                if (!current?.languages) return languagesAgg;
                const languages = Object.keys(current?.languages);
                if (!Array.isArray(languages)) return languagesAgg;
                languages.forEach(languageKey => {
                    if (languagesAgg[languageKey]) {
                        languagesAgg[languageKey] = languagesAgg[languageKey] + 1;
                    } else {
                        languagesAgg[languageKey] = 1;
                    }
                });
                return languagesAgg;
            }, {});

            console.log(languagesAggregation);

            // Sort the languages by count in descending order and get the top 10
            const top10Languages = Object.entries(languagesAggregation)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);

            const top10LanguagesLabels = top10Languages.map(entry => entry[0]);
            const top10LanguagesData = top10Languages.map(entry => entry[1]);

            const populationByRegion = data.reduce((regionPopulation, current) => {
                if (regionPopulation[current.region]) {
                    regionPopulation[current.region] = regionPopulation[current.region] + Number(current.population);
                } else {
                    regionPopulation[current.region] = Number(current.population);
                }
                return regionPopulation;
            }, {});
            console.log(populationByRegion);

            const barColors = [
                "red",
                "yellow",
                "blue",
                "green",
                "pink",
                "purple",
                "black",
                "orange",
                "cyan",
                "magenta"
            ];

            chartElement = new Chart("populationBarChart", {
                type: "bar",
                data: {
                    labels: Object.keys(populationByRegion),
                    datasets: [{
                        label: "population",
                        data: Object.values(populationByRegion),
                        backgroundColor: ["red", "red", "red", "red", "red", "red"],
                    },
                    {
                        label: "married",
                        data: [300001100, 56411065, 5611460, 13004114, 65004165, 300],
                        backgroundColor: ["yellow", "yellow", "yellow", "yellow", "yellow"],
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                },
            });

            new Chart("currencyPieChart", {
                type: "pie",
                data: {
                    labels: Object.keys(currencyAggregation),
                    datasets: [{
                        label: "currencies",
                        data: Object.values(currencyAggregation),
                        backgroundColor: barColors,
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                },
            });

            new Chart("languagesPieChart", {
                type: "pie",
                data: {
                    labels: top10LanguagesLabels,
                    datasets: [{
                        label: "languages",
                        data: top10LanguagesData,
                        backgroundColor: barColors.slice(0, top10Languages.length),
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                },
            });

        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    });
}

init();

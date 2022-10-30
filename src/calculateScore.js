export function calculateScore(stuff){

        function findTimeNearSunset(data){
        let sunsetTime = data['city']['sunset'];
        let dataToAnalyze = data['list'][0];
        let timeDiff = absoluteValue(sunsetTime - dataToAnalyze['dt']);

        for(let i = 0; i < data['list'].length; i++){
            if(absoluteValue(data['list'][i]['dt'] - sunsetTime) < timeDiff){
                dataToAnalyze = data['list'][i];
                timeDiff = sunsetTime - dataToAnalyze['dt'];
            }
        }
        return dataToAnalyze;
    }

    function findRainEndTime(data){
        let rainEndTime = 0;
        let sunset = data['city']['sunset'];
        // find the last time the rain ended before sunset
        // check if rains before sunset
        for(let i = 0; i < data['list'].length; i++){
            if(data['list'][i]['dt'] < sunset && (data['list'][i]['weather']['main'] === 'Thunderstorm' || data['list'][i]['weather']['main'] === 'Drizzle' || data['list'][i]['weather']['main'] === 'Rain' || data['list'][i]['weather']['main'] === 'Snow')){
                rainEndTime = data['list'][i]['dt'];
            }
            }
        return rainEndTime;
    }

    function absoluteValue(num){
        if(num < 0){
            return -num;
        }
        return num;
    }

    function sunsetModel(data){

        let time = findTimeNearSunset(data);
        let rainEndTime = findRainEndTime(data);
        let humidity = time['main']['humidity'];
        let windSpeed = time['wind']['speed'];
        let cloudCover = time['clouds']['all'];
        let score = 0;
        let sweetSpotCloudCover = 45;
        if (cloudCover >= 30 && cloudCover <= 60){
            score = score + absoluteValue(sweetSpotCloudCover - cloudCover) * (3/15) + 3;
        }
        else if (cloudCover > 60 && cloudCover <= 70){
            score = score + absoluteValue(sweetSpotCloudCover - cloudCover) * (1/10) + 2;
        }
        else if (cloudCover > 70 && cloudCover <= 100){
            score = score + absoluteValue(sweetSpotCloudCover - cloudCover) * (1/30) + 0;
        }
        else if (cloudCover > 100){
            score = score + 0;
        }
        else if (cloudCover < 30 && cloudCover >= 0){
            score = score + absoluteValue(sweetSpotCloudCover - cloudCover) * (1/30) + 1;
        }
        else if (cloudCover < 0){
            score = score + 0;
        }

        let lowHumidity = 40;
        let humidityLine1 = createLineWithTwoPoints(0, 100, lowHumidity, 80);
        let humidityLine2 = createLineWithTwoPoints(lowHumidity, 80, 100, 0);

        if (humidity >= 0 && humidity <= lowHumidity){
            score = score + ((humidityLine1(humidity) / 100) * 2);
        }
        else if (humidity > lowHumidity && humidity <= 100){
            score = score + ((humidityLine2(humidity) / 100) * 2);
        }

        let maxWindSpeed = 15;
        let windSpeedLine = createLineWithTwoPoints(0, 100, maxWindSpeed, 0);
        if (windSpeed >= 0 && windSpeed <= maxWindSpeed){
            score = score + ((windSpeedLine(windSpeed) / 100) * 2);
        }
        else if (windSpeed > maxWindSpeed){
            score = score + 0;
        }

        // Rain is a bonus for the sunset
        // This adds two points to the score
        // if the rain end time is between 1 to 5 hours before sunset, add two points
        // if the rain end time is between 6 to 10 hours before sunset, add one point
        // if the rain end time is between 11 to 24 hours before sunset, add a half point
        // if the rain end time is more than 24 hours before sunset, add zero points
        let sunsetTime = data['city']['sunset'];
        if (rainEndTime <= sunsetTime - hoursInUnix(1) && rainEndTime >= sunsetTime - hoursInUnix(5)){
            score = score + 2;
        }
        else if (rainEndTime <= sunsetTime - hoursInUnix(6) && rainEndTime >= sunsetTime - hoursInUnix(10)){
            score = score + 1;
        }
        else if (rainEndTime <= sunsetTime - hoursInUnix(11) && rainEndTime >= sunsetTime - hoursInUnix(24)){
            score = score + 0.5;
        }
        else {
            score = score + 0;
        }

        return score;
    }

    function hoursInUnix(numHours){
        return numHours * 60 * 60;
    }

    function createLineWithTwoPoints(x1, y1, x2, y2){
        let m = (y2 - y1) / (x2 - x1);
        let b = y1 - m * x1;
        return function(x){
            return m * x + b;
        }
    }



    function militaryToStandard(time){
        time = time.split(':');
        var hours = time[0];
        var minutes = time[1];
        var seconds = time[2];
        if (hours > 12) {
            hours = hours - 12;
            var ampm = 'PM';
        } else {
            var ampm = 'AM';
        }
        return hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    }

    return sunsetModel(stuff);
}


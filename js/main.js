$(document).ready(function(){

    var rssUrl = "http://www.loteriasyapuestas.es/es/bonoloto/resultados/.formatoRSS";
    function parseRSS(url, callback) {
        $.ajax({
            url: 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(url),
            dataType: 'json',
            success: function(data) {
                callback(data);
                console.log("Llamada Json completada ------",data);
            }
        });
    }

    var htmlResultTable = "";
    var result_final = new Array();
    var previousDate = "";

    parseRSS(rssUrl, function(rss) {

        var allResults = rss.items.reverse();
        for(i = allResults.length-1; i >=0; i--) {

                var _rawResults = allResults[i].content;

                var result = _rawResults.match(/<b>(.*?)<\/b>/g).map(function(val){
                    return val.replace(/<\/?b>/g,'');
                });

                result_final[i] = result;
                result_final[i][0] = result[0].match(/\d+/g).map(function(val){
                    return val.replace(/\-/g,'');
                });
                
                result_final[i][0].reverse();

                var resultsDate = new Date(allResults[i].pubDate);
                

                result_final[i][1] = result[1].replace(/[CR]\(+\)/g,'').match(/\d+/g,'');
                result_final[i][2] = result[2].replace(/[CR]\(+\)/g,'').match(/\d+/g,'');
                result_final[i][3] = new Array();
                result_final[i][3][0] = moment(resultsDate).format('dddd');
                result_final[i][3][1] = moment(resultsDate).format('D-MMMM-YYYY');


                if (result_final[i][3][1] === previousDate) continue;
                    else previousDate = result_final[i][3][1];


                htmlResultTable +="<tr><td><span class='weekDay'>"+result_final[i][3][0]+"</span><br><span class='monthDay'> "+result_final[i][3][1]+"</span></td>";
                htmlResultTable += "<td class='bonoloto'><ul class='balls'>";

                var dayResults = result_final[i];


                for(ball = dayResults[0].length-1; ball >=0; ball--) {
                    htmlResultTable += "<li class='ball'>" + dayResults[0][ball] + "</li>";  
                }

                htmlResultTable += "<li class='bonus-ball bonus'>" + dayResults[1] + "</li>";
                htmlResultTable += "<li class='reintegro bonus'>" + dayResults[2] + "</li>";
                htmlResultTable += "</ul></td>";
                // htmlResultTable +="<td></td></tr>";
                htmlResultTable +="</tr>";


                $("tbody#rss-results").html(htmlResultTable);

            }

        });


});

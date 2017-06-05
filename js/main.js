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

        // var results = rss.items;
        for(i = rss.items.length-1; i >=0; i--) {

                var _rawResults = rss.items[i].content;

                var result = _rawResults.match(/<b>(.*?)<\/b>/g).map(function(val){
                    return val.replace(/<\/?b>/g,'');
                });

                result_final[i] = result;
                result_final[i][0] = result[0].match(/\d+/g).map(function(val){
                    return val.replace(/\-/g,'');
                });


                var resultsDate = new Date(rss.items[i].pubDate);
                

                result_final[i][1] = result[1].replace(/[CR]\(+\)/g,'').match(/\d+/g,'');
                result_final[i][2] = result[2].replace(/[CR]\(+\)/g,'').match(/\d+/g,'');
                result_final[i][3] = moment(resultsDate).format('dddd D-MMMM-YYYY');


                if (result_final[i][3] === previousDate) continue;
                    else previousDate = result_final[i][3];


                htmlResultTable +="<tr><td>"+result_final[i][3]+"</td>";
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

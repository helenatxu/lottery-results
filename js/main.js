$(document).ready(function(){

    // $("#portfolio-contant-active").mixItUp();


    // $("#testimonial-slider").owlCarousel({
    //     paginationSpeed : 500,      
    //     singleItem:true,
    //     autoPlay: 3000,
    // });




    // $("#clients-logo").owlCarousel({
    //     autoPlay: 3000,
    //     items : 5,
    //     itemsDesktop : [1199,5],
    //     itemsDesktopSmall : [979,5],
    // });


        var rssUrl = "http://www.loteriasyapuestas.es/es/bonoloto/resultados/.formatoRSS";
        function parseRSS(url, callback) {
            $.ajax({
                url: 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(url),
                dataType: 'json',
                success: function(data) {
                    callback(data);
                    console.log("json",data);
                }
            });
        }
        html = "";
        var html2 = "";

        var result_final = new Array();

        parseRSS(rssUrl, function(rss) {

            var results = rss.items;
            for(i = results.length-1; i >=0; i--) {
                // html += "<p><a href='" + results[i].link + "'>" + results[i].title + "</a></p>";  

                console.log("rss",rss);

                var _rawResults = rss.items[i].content;

                var result = _rawResults.match(/<b>(.*?)<\/b>/g).map(function(val){
                    return val.replace(/<\/?b>/g,'');
                });

                result_final[i] = result;
                result_final[i][0] = result[0].match(/\d+/g).map(function(val){
                    return val.replace(/\-/g,'');
                });
                console.log("result_final[i]",result_final[i]);



                result_final[i][1] = result[1].replace(/[CR]\(+\)/g,'').match(/\d+/g,'');
                result_final[i][2] = result[2].replace(/[CR]\(+\)/g,'').match(/\d+/g,'');
                result_final[i][3] = rss.items[i].pubDate;

                console.log("result_final "+i, result_final[i]);

                html2 +="<tr><td style='text-align: center;'>"+result_final[i][3]+"</td>";
                html2 += "<td style='text-align: center; white-space: nowrap;' class='bonoloto'><ul class='balls'>";

                var dayResults = result_final[i];


                for(ball = dayResults[0].length-1; ball >=0; ball--) {
                    // console.log("html2", html2);
                    html2 += "<li class='ball'>" + dayResults[0][ball] + "</li>";  
                }

                html2 += "<li class='bonus-ball bonus'>" + dayResults[1] + "</li>";
                html2 += "<li class='reintegro bonus'>" + dayResults[2] + "</li>";
                html2 += "</ul></td>";
                html2 +="<td style='text-align: center;'>Bote acumulado</td></tr>";


                $("tbody#rss-results").html(html2);
                // console.log("html2", html2);

            }

        });


});

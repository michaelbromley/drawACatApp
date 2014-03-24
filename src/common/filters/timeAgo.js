/**
 * Created by Michael on 24/03/14.
 */
angular.module('drawACat.common.filters')
/**
 * Format a timestamp in terms of how long ago it was. Based on https://gist.github.com/rodyhaddad/5896883
 */
.filter("timeAgo", function () {
        //time: the time
        //local: compared to what time? default: now
        //raw: whether you want in a format of "5 minutes ago", or "5 minutes"
        return function (time, local, raw) {
            if (!time) {
                return "never";
            }

            if (!local) {
                local = Date.now();
            }

            if (angular.isDate(time)) {
                time = time.getTime();
            } else if (typeof time === "string") {
                time = new Date(parseInt(time, 10)).getTime();
            }

            if (angular.isDate(local)) {
                local = local.getTime();
            }else if (typeof local === "string") {
                local = new Date(local).getTime();
            }

            if (typeof time !== 'number' || typeof local !== 'number') {
                return time;
            }

            var
                offset = Math.abs((local - time) / 1000),
                span = [],
                MINUTE = 60,
                HOUR = 3600,
                DAY = 86400,
                WEEK = 604800,
                MONTH = 2629744,
                YEAR = 31556926,
                DECADE = 315569260;

            if (offset <= MINUTE)              {span = [ '', raw ? 'now' : 'less than a minute' ];}
            else if (offset < (MINUTE * 60))   {span = [ Math.round(Math.abs(offset / MINUTE)), 'min' ];}
            else if (offset < (HOUR * 24))     {span = [ Math.round(Math.abs(offset / HOUR)), 'hr' ];}
            else if (offset < (DAY * 7))       {span = [ Math.round(Math.abs(offset / DAY)), 'day' ];}
            else if (offset < (WEEK * 52))     {span = [ Math.round(Math.abs(offset / WEEK)), 'week' ];}
            else if (offset < (YEAR * 10))     {span = [ Math.round(Math.abs(offset / YEAR)), 'year' ];}
            else if (offset < (DECADE * 100))  {span = [ Math.round(Math.abs(offset / DECADE)), 'decade' ];}
            else                               {span = [ '', 'a long time' ];}

            span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
            span = span.join(' ');

            if (raw === true) {
                return span;
            } else {
                return (time <= local) ? span + ' ago' : 'in ' + span;
            }
        };
    })
;
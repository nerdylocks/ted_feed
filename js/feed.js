//EXTEND JS
(function(){var e=false,t=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){};Class.extend=function(n){function o(){if(!e&&this.init)this.init.apply(this,arguments)}var r=this.prototype;e=true;var i=new this;e=false;for(var s in n){i[s]=typeof n[s]=="function"&&typeof r[s]=="function"&&t.test(n[s])?function(e,t){return function(){var n=this._super;this._super=r[e];var i=t.apply(this,arguments);this._super=n;return i}}(s,n[s]):n[s]}o.prototype=i;o.prototype.constructor=o;o.extend=arguments.callee;return o}})();

var Bit = {
  init: function () {
    $('#show_list_view').on('click', $.proxy(function(event){
      event.preventDefault();
      this.View.List();
    }, this));

    $('#show_thumbnail_view').on('click', $.proxy(function(event){
      event.preventDefault();
      this.View.Thumbnails();
    }, this));

    $('aside').css({
      height: $(document).height() - 100
    });

    this.View.showDetail();
  },
  onSuccess: function(callback){
    callback();
  },
  Model: {},
  fetchData: function () {
    var feed = new google.feeds.Feed("http://feeds.feedburner.com/tedtalks_video");
    feed.setNumEntries(25);
    feed.load(function(result) {
      if (!result.error) {
        Bit.Model = result.feed.entries;
        Bit.onSuccess(Bit.View.List);
      }
    });
  },
  View: {
    List: $.proxy(function(){
      $('#thumbnail_view').hide(function(){
        $('#list_view').show(function(){
          $('ul#feed').html('');
          $.each(Bit.Model, function(i, value){
            $('ul#feed').append('<li data-feed-number="' +  i +'"><img width="80" class="img-rounded" src="' + value.mediaGroups[0].contents[0].thumbnails[0].url + '">' + value.title.substr(5) + '</li>');
          });
          $('#feed li:first-child').trigger('click');
       });
      });

    }, this),
    Thumbnails: $.proxy(function(){
        $('#list_view').hide(function(){
          $('#thumbnail_view').show(function(){
            $('ul#thumbnail_list').html('');
            $.each(Bit.Model, function(i, value){
              $('ul#thumbnail_list').append('<li><div class="expandable"><img width="180"  class="img-rounded" src="'
                + value.mediaGroups[0].contents[0].thumbnails[0].url
                + '"><div class="info">'
                + '<p class="title"><b>' + value.title + '<p></p>'
                + '<p class="snippet">' + value.contentSnippet + '<p>'
                + '<p class="posted"><span>Posted: </span>' + (new Date(value.publishedDate).getMonth() + 1) + '/' + new Date(value.publishedDate).getDate() + '/' + new Date(value.publishedDate).getFullYear() + '</p>'
                + '</div></div></li>');
            });
          });
        });
        
    }, this),
    showDetail: function(){
      $('#feed').on('click', 'li', function(){
        $('#details .content').html('<h3>' + Bit.Model[$(this).data('feed-number')].title + '</h3>')
        .append('<video preload="auto" poster="' + Bit.Model[$(this).data('feed-number')].mediaGroups[0].contents[0].thumbnails[0].url +'" class="video" controls><source src="' + Bit.Model[$(this).data('feed-number')].mediaGroups[0].contents[0].url + '" type="video/mp4"></video>')
        .append('<p class="desc">' + Bit.Model[$(this).data('feed-number')].content + '<p>')
        $(this).parent().find('li').removeClass('active');
        $(this).addClass('active');
      });

    }
  }
};
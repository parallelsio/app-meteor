//$(function() {
//  //  changes mouse cursor when highlighting loawer right of box
//  $(document).on('mousemove', 'textarea', function(e) {
//    var a = $(this).offset().top + $(this).outerHeight() - 16,	//	top border of bottom-right-corner-box area
//      b = $(this).offset().left + $(this).outerWidth() - 16;	//	left border of bottom-right-corner-box area
//    $(this).css({
//      cursor: e.pageY > a && e.pageX > b ? 'nw-resize' : ''
//    });
//  })
//    //  the following simple make the textbox "Auto-Expand" as it is typed in
//    .on('keyup', 'textarea', function(e) {
//      //  the following will help the text expand as typing takes place
//      while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
//        $(this).height($(this).height()+1);
//      };
//    })
//    .on('keydown', 'textarea', function (e) {
//      var keyCode = e.keyCode || e.which;
//      if (keyCode == 9) {
//        e.preventDefault();
//        var start = $(this).get(0).selectionStart;
//        var end = $(this).get(0).selectionEnd;
//
//        // set textarea value to: text before caret + tab + text after caret
//        $(this).val($(this).val().substring(0, start)
//          + "\t"
//          + $(this).val().substring(end));
//
//        // put caret at right position again
//        $(this).get(0).selectionStart =
//          $(this).get(0).selectionEnd = start + 1;
//      }
//    });
//});

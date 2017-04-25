 /*Controlling the MultiStep Form*/

    //jQuery time
    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    var animating; //flag to prevent quick multi-click glitches

    $(".next").click(function(){


      current_fs = $(this).parent().parent();
      console.log(current_fs)
      next_fs = $(this).parent().parent().next();
      console.log(next_fs)

      //activate next step on progressbar using the index of next_fs
      $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

      //show the next fieldset
      next_fs.show();

      //hide the current fieldset
      current_fs.hide();

    });

    $(".previous").click(function(){


      current_fs = $(this).parent().parent();
      previous_fs = $(this).parent().parent().prev();

      //de-activate current step on progressbar
      $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

      //show the previous fieldset
      previous_fs.show();

      //hide the current fieldset
      current_fs.hide();

    });

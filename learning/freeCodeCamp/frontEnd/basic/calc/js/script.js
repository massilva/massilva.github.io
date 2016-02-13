$(document).ready(function(){
  var panel = [
    'C' ,'()', '%' , '/',
     7  , 8  ,  9  , 'x',
     4  , 5  ,  6  , '-',
     1  , 2  ,  3  , '+',
    '.' , 0  , '+-', '='
  ];
  var button = $("#panel button");
  var display = $("input[name='display']");
  var display_arr = [];
  var result, last_idx = 0;
  for (var i = panel.length - 1; i >= 0; i--) {
    $(button[i]).html(panel[i]);
    $(button[i]).attr("data-value",panel[i]);
  };
  button.on("click",function(){
    var value = $(this).attr("data-value");
    if($.isNumeric(value)){
      display_arr[last_idx] = display_arr[last_idx] !== undefined ? display_arr[last_idx] + value : value;
    } else {
      switch(value){
        case 'C':
          display_arr = [];
          result = undefined;
          break;
        case '()':
          break;
        case '+-':
          break;
        case '=':
          console.log(display_arr);
          break;
        default:
          addSymbol(value);
      }
    }
    updateDisplay();
  });
  function addSymbol(ch){
    if(isValidToInsert(display_arr[display_arr.length-1])){
      display_arr.push(ch);
      last_idx = display_arr.length;
    }else{
      display_arr[display_arr.length-1] = ch;
    }
  }
  function isValidToInsert(ch){
    return ch == ")" || ch == "(" || $.isNumeric(ch);
  }
  function updateDisplay(){
    display.val(display_arr.join(""));
  }
});
$(document).ready(function(){
  $('.seat > a,seats-back > a').tooltip();
  $('input[name=bookingdate]').datepicker({
    // startDate: '0d',
    format: 'dd/mm/yyyy',
    autoclose: true,
    todayHighlight:true,
    todayBtn:"linked"
  });
  $('input[name=journeydate],input[name=loadingdate]').datepicker({
    startDate: '0d',
    format: 'dd/mm/yyyy',
    autoclose: true,
    todayHighlight:true,
    todayBtn:"linked"
  });
  var seatParentContainer = $('#seatBooking');
  seatParentContainer.find('.seat').on('click', function(){
  	if(!$(this).hasClass('seat-booked')) {
  		$(this).toggleClass('seat-selected');
  	}
  });
  $('#seatBookingForm').submit(doSeatBooking);
  $('#luggageBookingForm').submit(validateLuggageBookingForm);
  // for luggage pages
  // $('.loading-btn').on('click',setForLoading);
  $('#loadBookedLuggage').on('click',setForLoading);
  $('#removeLoadedLuggage').on('click',removeLoadedLuggage);
  $('.luggage-cancel-btn').on('click',cancelLuggageBooking);

  $('.seat-cancel-btn').on('click',cancelSeatBooking);

});

function doSeatBooking(evt){
  var seatsArray = [];
    $('#seatBookingMap .seat-selected').each(function(index){
      seatsArray.push($(this).data('seat-name'));
    });
    $('#sleeperBookingMap .seat-selected').each(function(index){
      seatsArray.push($(this).data('seat-name'));
    });
    if(seatsArray.length != 0 ){
      $(this).find('input[name=seat_numbers]').val(seatsArray.join(','));
    }
    else {
      alert('Please select a seat');
      evt.preventDefault();
      return;
    }
    if(!validateSeatBookingForm()){
      evt.preventDefault();
      return;
    }
}

function validateSeatBookingForm(){

  var $form = $('#seatBookingForm');

  if(isEmpty('customer_name',$form)){
    alert('Please fill Customer Name');
    return false;
  }
  if(isEmpty('phone_number',$form)){
    alert('Please fill Phone Number');
    return false;
  }
  if(isEmpty('phone_number',$form)){
    alert('Please fill Phone Number');
    return false;
  }
  if(isEmpty('departure_time',$form)){
    alert('Please fill Departure Time');
    return false;
  }
  if(isEmpty('amount',$form)){
    alert('Please fill Amount');
    return false;
  }
  return true;
}

function validateLuggageBookingForm(evt){

  var $form = $('#luggageBookingForm');
  if(isEmpty('from_name',$form)){
    alert('Please fill From Name');
    return false;
  }
  if(isEmpty('to_name',$form)){
    alert('Please fill To Name');
    return false;
  }
  if(isEmpty('station',$form)){
    alert('Please fill Station');
    return false;
  }
  if(isEmpty('parcel',$form)){
    alert('Please fill Parcel');
    return false;
  }
  if(isEmpty('transporting_charges',$form)){
    alert('Please fill Transport Charges');
    return false;
  }
  /*if(isNotValidNumber('transporting_charges',$form)){
    alert('Amount should be number only');
    return false;
  }*/
  return true;
}

function isNotValidNumber(fieldName,form){
  var $elem = form.find('input[name=' + fieldName + ']');
  var num = $elem.val();
  if(isNaN(num)) return true;
  return false;
}

function isEmpty(fieldName,form){
  var $elem = form.find('input[name=' + fieldName + ']');
  if($.trim($elem.val()) == '') return true;
  else return false;
}

function cancelSeatBooking(evt){
  var sure = confirm("Are you sure want to cancel this booking ?");
  if(sure) {
    var bookingId = $(this).data('bookingid');
    var $row = $(this).closest('tr');
    $.ajax({
      url : '/seat/cancel',
      data : {bookingid : bookingId}
    }).done(function(){
      alert("Seat booking cancelled");
      $row.remove();
    });
  }
}

function setForLoading(evt){
  var loadingDate = $('input[name=loadingdate]').val()
    , busNumber   = $('select[name=busnumber]').val();
  if(loadingDate !== ''){
    var parcelIds = [];
    $('#luggageHistoryTbl input[type=checkbox]:checked').each(function(){
      parcelIds.push($(this).attr('data-parcel-id'));
    });
    if (parcelIds.length == 0) {
      alert('Please select at least 1 parcel');
      return;
    };
    $.ajax({
      url : '/setluggagetoload',
      data : {
        bookingids  : parcelIds.join(','),
        loadingdate : loadingDate,
        busnumber   : busNumber
      }
    }).done(function(){
      alert("Loaded");
      $('#luggageHistoryTbl input[type=checkbox]:checked').each(function(){
        $(this).closest('tr').remove();
      });
    });
  }
  else {
    alert('Please select a date');
    return;
  }
}

function removeLoadedLuggage(evt){
  var parcelIds = [];
  $('#luggageHistoryTbl input[type=checkbox]:checked').each(function(){
    parcelIds.push($(this).attr('data-parcel-id'));
  });
  if (parcelIds.length == 0) {
    alert('Please select at least 1 parcel');
    return;
  };
  $.ajax({
    url : '/removeloadedluggage',
    data : {
      bookingids  : parcelIds.join(',')
    }
  }).done(function(){
    alert("Removed from loading");
    $('#luggageHistoryTbl input[type=checkbox]:checked').each(function(){
      $(this).closest('tr').remove();
    });
  });
}

function cancelLuggageBooking(evt){
  var sure = confirm("Are you sure want to cancel this booking ?");
  if(sure){
    var bookingId = $(this).data('parcel-id');
    var $row = $(this).closest('tr');
    $.ajax({
      url : '/removeluggage',
      data : {bookingid : bookingId}
    }).done(function(){
      alert("Luggage booking cancelled");
      $row.remove();
    });
  }
}
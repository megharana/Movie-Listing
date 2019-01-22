var request = new XMLHttpRequest();
var budget_list = [];
var title_year_list = [];
var titles = ["Genre", "Language", "Country", "Budget", "TitleYear"];
var pop_filter_submit_list = [];

readJSON(11);
var pageNum;
var startIndex;
var upperLimit;
function readJSON(endIndex) {
  startIndex = endIndex - 11;
  request.open("GET", "http://starlord.hackerearth.com/movies", true);
  upperLimit = endIndex;

  document.getElementById(endIndex).style.backgroundColor = "#F5CCFE";

  var tableForMovie =
    '<table class ="tableStyling" cellpadding="0" cellspacing="0" border = 1 align = "center"><tbody><tr>';
  request.onload = function() {
    var data = JSON.parse(this.response);
    console.log(data);

    //var lengthOfResults = data.results.length;

    if (request.status >= 200 && request.status < 400) {
      for (var i = 0; i < 5; i++)
        tableForMovie +=
          "<th>" +
          titles[i] +
          "<input type='image' id='" +
          titles[i] +
          "' src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-down-b-512.png' class='hidden'></th>";
      //tableForMovie += "<th><div " + titles[i] + "<a><img id='pic" + i + "'src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-down-b-512.png' class='hidden'></img></a></th>";
      var i = 0,
        n = 0;
      for (var i = startIndex; i < endIndex; i++) {
        //console.log(movie.title);
        tableForMovie += "</tr><tr>";
        tableForMovie += "<td>" + data[i].genres + "</td>";
        tableForMovie += "<td>" + data[i].language + "</td>";
        tableForMovie += "<td>" + data[i].country + "</td>";
        tableForMovie += "<td>" + data[i].budget + "</td>";
        tableForMovie += "<td>" + data[i].title_year + "</td>";
        tableForMovie += "</tr><tr>";
        budget_list.push(data[i].budget);
        title_year_list.push(data[i].title_year);
      }
      budget_list = Array.from(new Set(budget_list));
      title_year_list = Array.from(new Set(title_year_list));
    } else {
      console.log("error");
    }

    document.getElementById("movieTable").innerHTML = tableForMovie;

    getModal();
  };
  request.send();
}

function filter() {
  for (var i = 0; i < 5; i++) {
    var img = document.getElementById(titles[i]);
    img.classList.toggle("hidden");
  }
  var filter_btn = document.getElementById("filter_btn");
  if (filter_btn.style.background == "white") {
    filter_btn.style.background = "blue";
  } else {
    filter_btn.style.background = "white";
  }
}

function sortBtnActive() {
  var modal = document.getElementById("modal_sort");
  var span = document.getElementById("modal_sort_close");

  var modal_sort_content =
    "<form id='sort_form'><p><label>Choose column</label></p>";
  for (var i = 0; i < 5; i++) {
    modal_sort_content +=
      "<p><label><input type='radio' id='option_" +
      titles[i] +
      "' class='filled-in' value='" +
      titles[i] +
      "'/><span>" +
      titles[i] +
      "</span></label></p>";
  }
  modal_sort_content +=
    "</form><button onclick='()' id='sort_filter'>Sort</button>";
  console.log(document.getElementById("modal_sort_header"));
  document.getElementById("modal_sort_header").innerHTML += modal_sort_content;
  modal.style.display = "block";

  //When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function getModal() {
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // Get the button that opens the modal
  var dropDownButton = document.getElementById("TitleYear");

  dropDownButton.onclick = function() {
    modal.style.display = "block";
  };
  var modal_content = "<form id='pop_form'><p><label>Choose option</label></p>";
  for (var i = 0; i < title_year_list.length; i++) {
    modal_content +=
      "<p><label><input type='checkbox' id='option" +
      i +
      "' class='filled-in' value='" +
      title_year_list[i] +
      "'/><span>" +
      title_year_list[i] +
      "</span></label></p>";
  }
  modal_content +=
    "</form><button onclick='get_pop_filter_add_list()' id='pop_filter'>Apply</button>";

  document.getElementsByClassName("modal-header")[0].innerHTML += modal_content;

  //When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function get_pop_filter_add_list() {
  var popularity_form = document.getElementById("pop_form");
  console.log(popularity_form);
  var checked_element = document.getElementsByClassName("filled-in");
  for (var i = 0; checked_element[i]; ++i) {
    if (checked_element[i].checked) {
      console.log(checked_element[i].value);
      pop_filter_submit_list.push(checked_element[i].value);
    }
  }
  update_table(pop_filter_submit_list);
  document.getElementById("myModal").style.display = "none";
}

function update_table(pop_filter_submit_list) {
  request.open("GET", "http://starlord.hackerearth.com/movies", true);
  console.log("list_pop" + pop_filter_submit_list);
  request.onload = function() {
    var data = JSON.parse(this.response);

    var updated_table =
      '<table class ="tableStyling" cellpadding="0" cellspacing="0" border = 1 align = "center"><tbody><tr>';
    if (request.status >= 200 && request.status < 400) {
      for (var i = 0; i < 5; i++)
        updated_table +=
          "<th>" +
          titles[i] +
          "<input type='image' id='" +
          titles[i] +
          "' src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-down-b-512.png'></th>";
      for (var i = startIndex; i < upperLimit; ++i) {
        for (var j = 0; j < pop_filter_submit_list.length; j++) {
          if (data[i].title_year == pop_filter_submit_list[j]) {
            //console.log("Matched : " + data.results[i].popularity);
            updated_table += "</tr><tr>";
            updated_table += "<td>" + data[i].genres + "</td>";
            updated_table += "<td>" + data[i].language + "</td>";
            updated_table += "<td>" + data[i].country + "</td>";
            updated_table += "<td>" + data[i].budget + "</td>";
            updated_table += "<td>" + data[i].title_year + "</td>";
          }
        }
      }
    }
    document.getElementById("movieTable").innerHTML = updated_table;
  };
  request.send();
}

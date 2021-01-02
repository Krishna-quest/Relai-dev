
    <!-- The Modal -->
  <div class="modal permission-modal fade " id="myModal">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header text-center">
          <h2 class="modal-title w-100">Raise a Complaint</h2>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <select class="form-control " id="selectBox">
            <option value="0">Select professional</option>
            <option value="">2</option>
          </select>

          <input type="text" class="form-control  form-control-fix2" id="subject" placeholder="Subject" name="subject">
          <textarea class="form-control  form-control-fix2" rows="3" id="comment">Add Notes</textarea>

          <div class="model-btn-fix">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-cancel" data-dismiss="modal">Submit</button>
        </div>
      </div>
    </div>
  </div>
    <div class="dashboard-wpr">
      <div class="container-fluid">
        <div class="row content">
          <div class="col-sm-2 sidenav hidden-xs-down">
            <div class="user-login text-center">
              <div class="user-profile">
                <img src="images/user-3.png" alt="" title="">
              </div>
              <div class="user-name">
                <h6>John Doe,<span><i>
                      Architect</i>
                  </span></h6>

                <a href="#"><i>johndoe12@gmail.com</i></a>
              </div>
            </div>
            <ul class="dashboard-nav">
              <li>
                <a href="dashboard-professional.html"><img class="act-img" src="images/dashboard-active.png"><img
                    src="images/dashboard.png"> Dashboard</a>
              </li>
              <li>
                <a href="track-your-progress-professionals.html"><img class="act-img" src="images/track-active.png"><img
                    src="images/track.png"> Track your progress</a>
              </li>
              <li class="active">
                <a href="property.html"><img class="act-img" src="images/dreamhome-active.png"><img
                    src="images/dreamhome.png"> Properties</a>
              </li>
              <li>
                <a href="complaints.html"><img class="act-img" src="images/complaints-active.png"><img
                    src="images/complaints.png"> Complaints</a>
              </li>

              <li>
                <a href="professionals-to-do-list.html"><img class="act-img" src="images/to-do-list-active.png"><img
                    src="images/to-do-list.png"> To do list</a>
              </li>
            </ul>
          </div>
          <div class="col-sm-12 col-lg-10">
            <div class="dashboard-inner">
              <div class="row back-to-home">
                <div class="breadcumb">
                  <ul>
                    <li><a href="myproperties-detail.html"><i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back
                        to Nacary Apartment</a></li>
                  </ul>
                </div>
              </div>
              <div class="todo-list-table">
                <div class="clearfix">
                  <div class="heading-top float-left">
                    <h2>Nacary Apartment <i class="fa fa-long-arrow-left" aria-hidden="true"></i> Phase A : Instruction
                    </h2>
                  </div>
                  <div class="total-time-cost float-right">
                    <div class="total-time"><a href="#">TOTAL TIME<br><span>525 days</span></a></div>
                    <div class="total-time"><a href="#">TOTAL COST<br><span>100,000 ￡</span></a></div>
                  </div>
                </div>
                <div class="phase-progress">
                  <ul>
                    <li><a href="#">25%</a></li>
                    <li><a href="#">25%</a></li>
                    <li><a href="#">25%</a></li>
                    <li><a href="#">25%</a></li>
                  </ul>
                </div>
                <div class="action-owner">
                  <div class="clearfix">
                    <div class="float-left">
                      <p>Action</p>
                    </div>

                  </div>
                </div>
                <table class="table table-responsive table-phase-fix1">
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>

                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td> <label class="check-todos">
                          <p>Instruct solicitor</p>
                          <input type="checkbox">
                          <span class="checkmark"></span>
                        </label></td>
                      <td><a href="#" class="upload-any"><img src="images/upload.png"><span>
                  <div class="custom-file-input">
                    <input type="file">
                    <input type="button">
                  </div>
                </span></a></td>
                      <td><a href="professionals-detail-message.html"><img src="images/chat.png"></a></td>
                      <td><a class="btn help-btn" href="#" data-toggle="modal" data-target="#myModal">Help</a></td>

                    </tr>
                    <tr>
                      <td><label class="check-todos">
                          <p>Instruct other professionals</p>
                          <input type="checkbox">
                          <span class="checkmark"></span>
                        </label></td>
                      <td><a href="#" class="upload-any"><img src="images/upload.png"><span>
                  <div class="custom-file-input">
                    <input type="file">
                    <input type="button">
                  </div>
                </span></a></td>
                      <td><a href="professionals-detail-message.html"><img src="images/chat.png"></a></td>
                      <td><a class="btn help-btn" href="#" data-toggle="modal" data-target="#myModal">Help</a></td>
                    </tr>
                    <tr>
                      <td><label class="check-todos">
                          <p>ID/Passport</p>
                          <input type="checkbox">
                          <span class="checkmark"></span>
                        </label></td>
                      <td><a href="#" class="upload-any"><img src="images/upload.png"><span>
                  <div class="custom-file-input">
                    <input type="file">
                    <input type="button">
                  </div>
                </span></a></td>
                      <td><a href="professionals-detail-message.html"><img src="images/chat.png"></a></td>
                      <td><a class="btn help-btn" href="#" data-toggle="modal" data-target="#myModal">Help</a></td>

                    </tr>
                    <tr>
                      <td><label class="check-todos">
                          <p>Proof of address</p>
                          <input type="checkbox">
                          <span class="checkmark"></span>
                        </label></td>
                      <td><a href="#" class="upload-any"><img src="images/upload.png"><span>
                  <div class="custom-file-input">
                    <input type="file">
                    <input type="button">
                  </div>
                </span></a></td>
                      <td><a href="professionals-detail-message.html"><img src="images/chat.png"></a></td>
                      <td><a class="btn help-btn" href="#" data-toggle="modal" data-target="#myModal">Help</a></td>

                    </tr>
                    <tr>
                      <td><label class="check-todos">
                          <p>Proof of fund (cash buyers)/agreement in principle (mortgage)</p>
                          <input type="checkbox">
                          <span class="checkmark"></span>
                        </label></td>
                      <td><a href="#" class="upload-any"><img src="images/upload.png"><span>
                  <div class="custom-file-input">
                    <input type="file">
                    <input type="button">
                  </div>
                </span></a></td>
                      <td><a href="professionals-detail-message.html"><img src="images/chat.png"></a></td>
                      <td><a class="btn help-btn" href="#" data-toggle="modal" data-target="#myModal">Help</a></td>

                    </tr>
                  </tbody>
                </table>
              </div>










            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  <!-- Optional JavaScript -->
  <!-- jQuery first, then Popper.js, then Bootstrap JS -->
  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
    integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
    integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
    crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
    integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
    crossorigin="anonymous"></script>
  <script>
    $(document).ready(function () {
      $(".sidenav ul li").click(function () {
        $(".sidenav ul li").removeClass("active");
        $(this).addClass("active");
      });
    });
    $(document).ready(function () {
      $(".right-navbar li").click(function () {
        $("right-navbar li").removeClass("active");
        $(this).addClass("active");
      });
    });
  </script>
  <script>
    $(document).ready(function () {
      $('.custom-file-input input[type="file"]').change(function (e) {
        $(this).siblings('input[type="text"]').val(e.target.files[0].name);
      });
    });
  </script>
</body>

</html>
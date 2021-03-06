
    <!-- The Modal -->
  <div class="modal permission-modal fade " id="myModal">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header text-center">
          <h2 class="modal-title w-100">Add Task to Phase 1</h2>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <label class="label-fix">Describe this to-do</label>
          <input type="text" class="form-control form-control-fix2" id="subject" placeholder="Instruction"
            name="todo-task">

          <select class="form-control " id="selectBox">
            <option value="0">Select professional</option>
            <option value="">2</option>
          </select>

          <input type="date" class="form-control  form-control-fix2" id="subject" placeholder="Due on" name="duedate">
          <textarea class="form-control  form-control-fix2" rows="2" id="comment">Add Notes(If any)</textarea>

          <div class="model-btn-fix">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-cancel" data-dismiss="modal">Add Task</button>

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
                <img src="images/profile.png" alt="" title="">
              </div>
              <div class="user-name">
                <h2>Andrew Wills</h2>
                <a href="#">andrewwills@gmail.com</a>
              </div>
            </div>
            <ul class="dashboard-nav">
              <li>
                <a href="dashboard.html"><img class="act-img" src="images/dashboard-active.png"><img
                    src="images/dashboard.png"> Dashboard</a>
              </li>
              <li>
                <a href="track-your-progress.html"><img class="act-img" src="images/track-active.png"><img
                    src="images/track.png"> Track your progress</a>
              </li>
              <li class="active">
                <a href="professionals.html"><img class="act-img" src="images/professionals-active.png"><img
                    src="images/professionals.png"> Professionals</a>
              </li>
              <li>
                <a href="mydreamhome-details-docs.html"><img class="act-img" src="images/dreamhome-active.png"><img
                    src="images/dreamhome.png"> My dream home</a>
              </li>
              <li>
                <a href="mydreamhome-details-to-dos.html"><img class="act-img" src="images/to-do-list-active.png"><img
                    src="images/to-do-list.png"> To do list</a>
              </li>
            </ul>
          </div>

          <div class="col-sm-12 col-lg-10">
            <div class="dashboard-inner">
              <div class="row">
                <div class="col-sm-12 col-lg-12">
            <div class=" user-fix">
              <div class="row">
                <div class="col-sm-12 col-lg-5">
                  <div class="user-profile-fix2 float-left">
                    <img src="images/user-4.png" alt="" title="">
                  </div>
                  <div class="user-name-fix float-left">
                    <h2>Alex Jackson</h2>
                    <p>Architect</p>
                  </div>
                </div>

                <div class="float-left icon-fix">
                  <img class=" card-image-fix" src="images/experience.png" alt="Card image cap">&nbsp;<span>5
                    years</span>
                </div>
                <div class="float-left icon-fix2">
                  <img class=" card-image-fix" src="images/rating.png" alt="Card image cap">&nbsp;<span>4.0
                    Rating</span>

                </div>
              </div>
            </div>
          </div>
        </div>
          <div class="row">
            <div class="col-sm-12 col-lg-12">
              <div class="hirenow-inner">
                <div class="docs-files-section">
                  <form class="form" action="#">

                    <div class="row">
                      <div class="col-sm-12 col-lg-12">
                        <div class="docs-files">
                          <div class="clearfix">
                            <div class="heading-top float-left">
                              <label class="">STEP 1</label>
                              <h6 class="">Select the property you want to hire professional for</h6>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-12 col-lg-12">
                        <div class="home-section">
                          <div class="row">
                            <div class="professional-input-box">
                              <div class="professional-text-fix">
                                <label>Select Property</label>
                                <select class="form-control form-control-lg form-control-size-fix"
                                  style="max-width: 100%; margin-bottom:10px;">
                                  <option value="0">
                                    Buena Visa Avenue
                                  </option>
                                  <option value="1">My professionals</option>

                                </select>
                              </div>

                            </div>
                            <div class="professional-input-box">
                              <div class="professional-text-fix">
                                <label>Address</label>
                                <input type="text" class="form-control form-control-size-fix " id="address"
                                  placeholder="1143 Buena Visa Avenue" name="address">
                              </div>

                            </div>
                            <div class="professional-input-box">
                              <div class="professional-text-fix">
                                <label>City</label>
                                <input type="text" class="form-control form-control-size-fix " id="city"
                                  placeholder="Rufus" name="city">
                              </div>

                            </div>
                          </div>
                          <div class="row">
                            <div class="professional-input-box">
                              <div class="professional-text-fix">
                                <label>State</label>
                                <input type="text" class="form-control form-control-size-fix " id="state"
                                  placeholder="Oregon" name="state">
                              </div>

                            </div>
                            <div class="professional-input-box">
                              <div class="professional-text-fix">
                                <label>Country</label>
                                <input type="text" class="form-control form-control-size-fix " id="country"
                                  placeholder="United States" name="country">
                              </div>

                            </div>
                            <div class="professional-input-box">
                              <div class="professional-text-fix">
                                <label>Zip code</label>
                                <input type="text" class="form-control form-control-size-fix " id="zipcode"
                                  placeholder="97050" name="zipcode">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-sm-6 col-lg-6">
                        <div class="heading-top float-left">
                          <label class="">STEP 2</label>
                          <h6 class="">Tell us your approximate budget</h6>

                          <div class="heading-top float-left">
                            <img class="progress-bar2" src="images/progress-bar2.png" alt="">
                          </div>


                        </div>

                      </div>
                      <div class="col-sm-6 col-lg-6">
                        <div class="heading-top float-left">
                          <label class="">STEP 3</label>
                          <h6 class="">Tell us expected delivery date</h6>
                        </div>
                        <div class="col-sm-6 col-lg-6">
                          <div class="heading-top float-left">
                            <input type="date" style="margin-top:5px" class="form-control form-control-size-fix "
                              id="deliveryDate" placeholder="1 Dec 2011" name="deliveryDate">
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-sm-12 col-lg-12">
                        <div class="docs-files">
                          <div class="clearfix">
                            <div class="heading-top float-left">
                              <label class="">STEP 4</label>
                              <h6 class="">Add phases</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-12 col-lg-12">
                        <div class="home-section">
                          <div class="row">
                            <div class="professional-input-box">
                              <div class="professional-text-fix">
                                <label>Phase1</label>
                                <input type="text" class="form-control form-control-size-fix " id="instruction"
                                  placeholder="Instruction" name="instruction">
                              </div>
                            </div>
                            <div class="professional-input-box">
                              <div class="professional-text-fix">
                                <label>Start Date</label>
                                <input type="date" class="form-control form-control-size-fix " id="startDate"
                                  placeholder="FullName" name="startDate">
                              </div>
                            </div>
                            <div class="professional-input-box">
                              <div class="professional-text-fix">
                                <label>End Date</label>
                                <input type="date" class="form-control form-control-size-fix " id="endDate"
                                  placeholder="FullName" name="endDate">
                              </div>
                            </div>
                            <div class="">
                              <div class="">
                                <a href="#" data-toggle="modal" data-target="#myModal" class="btn btn-add-task-fix">Add
                                  Task</a>

                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="professional-input-box">
                              <div class="professional-text-fix">
                                <label>Phase2</label>
                                <input type="text" class="form-control form-control-size-fix " id="phase2"
                                  placeholder="Pre-exchange Submitting the contract" name="phase2">
                              </div>

                            </div>
                            <div class="professional-input-box">
                              <div class="professional-text-fix">
                                <label>Start Date</label>
                                <input type="date" class="form-control form-control-size-fix " id="startDate"
                                  placeholder="FullName" name="endDate">
                              </div>
                            </div>
                            <div class="professional-input-box">
                              <div class="professional-text-fix">
                                <label>End Date</label>
                                <input type="date" class="form-control form-control-size-fix " id="endDate"
                                  placeholder="End Date" name="endDate">
                              </div>
                            </div>
                            <div class="">
                              <a href="#" class="btn btn-add-task-fix">Add
                                Task</a>
                            </div>
                            <div class="">
                              <a href="#" class="btn btn-add-plus-fix"><i class="fa fa-plus"></i></a>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div> <button type="submit" class="btn btn-next" style="width: 164px; border-radius: 5px;">Hire
                      Now</button>
                  </form>
                </div>
              </div>
            </div>
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
</body>

</html>
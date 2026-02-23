import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Include authentication system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  type Lesson = {
    id : Nat;
    title : Text;
    category : Text;
    estimatedTime : Nat; // in minutes
    difficulty : Text;
    segments : [LessonSegment];
  };

  type LessonSegment = {
    content : Text;
    exercise : ?InteractiveExercise;
  };

  type InteractiveExercise = {
    question : Text;
    options : [Text];
    correctAnswer : Text;
    explanation : Text;
  };

  type UserProgress = {
    completedLessons : [Nat];
    currentSegment : Map.Map<Nat, Nat>;
    xp : Nat;
    streak : Nat;
    lastActiveDay : Time.Time;
    badges : [Text];
  };

  type UserProgressView = {
    completedLessons : [Nat];
    currentSegment : [(Nat, Nat)];
    xp : Nat;
    streak : Nat;
    lastActiveDay : Time.Time;
    badges : [Text];
  };

  type Certificate = {
    id : Nat;
    user : Principal;
    skill : Text;
    completionDate : Time.Time;
    verificationId : Text;
  };

  // State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let lessons = Map.empty<Nat, Lesson>();
  let userProgress = Map.empty<Principal, UserProgress>();
  let certificates = Map.empty<Nat, Certificate>();

  var nextLessonId = 1;
  var nextCertificateId = 1;

  module Lesson {
    public func compare(l1 : Lesson, l2 : Lesson) : Order.Order {
      if (l1.id < l2.id) { #less } else if (l1.id > l2.id) { #greater } else { #equal };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Lesson Management
  public shared ({ caller }) func addLesson(lesson : Lesson) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add lessons");
    };
    let lessonWithId = { lesson with id = nextLessonId };
    lessons.add(nextLessonId, lessonWithId);
    nextLessonId += 1;
  };

  public query ({ caller }) func getLessonsByCategory(category : Text) : async [Lesson] {
    let filtered = lessons.values().toArray().filter(func(l) { l.category == category });
    filtered;
  };

  public query ({ caller }) func getAllLessons() : async [Lesson] {
    lessons.values().toArray().sort();
  };

  // User Progress
  public query ({ caller }) func getUserProgress() : async ?UserProgressView {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access progress");
    };
    switch (userProgress.get(caller)) {
      case (null) { null };
      case (?progress) {
        ?{
          completedLessons = progress.completedLessons;
          currentSegment = progress.currentSegment.toArray();
          xp = progress.xp;
          streak = progress.streak;
          lastActiveDay = progress.lastActiveDay;
          badges = progress.badges;
        };
      };
    };
  };

  public shared ({ caller }) func updateProgress(lessonId : Nat, segment : Nat, isComplete : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update progress");
    };

    let currentTime = Time.now();

    // Get or create user progress
    let progress = switch (userProgress.get(caller)) {
      case (?p) { p };
      case (null) {
        {
          completedLessons = [];
          currentSegment = Map.empty<Nat, Nat>();
          xp = 0;
          streak = 0;
          lastActiveDay = currentTime;
          badges = [];
        };
      };
    };

    // Update current segment
    let currentSegment = Map.empty<Nat, Nat>();
    currentSegment.add(lessonId, segment);

    // If lesson complete, update completed lessons and XP
    let (completedLessons, xp) = if (isComplete) {
      (
        progress.completedLessons.concat([lessonId]),
        progress.xp + 100,
      );
    } else {
      (progress.completedLessons, progress.xp);
    };

    let updatedProgress = {
      progress with
      completedLessons;
      currentSegment;
      xp;
      lastActiveDay = currentTime;
    };
    userProgress.add(caller, updatedProgress);
  };

  // Certification
  public shared ({ caller }) func generateCertificate(skill : Text) : async ?Certificate {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate certificates");
    };

    let completedLessons = switch (userProgress.get(caller)) {
      case (?p) { p.completedLessons };
      case (null) { [] };
    };
    let required = lessons.values().toArray().filter(func(l) { l.category == skill }).size();

    if (completedLessons.size() < required) { return null };

    let certificate = {
      id = nextCertificateId;
      user = caller;
      skill;
      completionDate = Time.now();
      verificationId = "CERT-" # nextCertificateId.toText();
    };
    certificates.add(nextCertificateId, certificate);
    nextCertificateId += 1;
    ?certificate;
  };

  public query ({ caller }) func verifyCertificate(verificationId : Text) : async ?Certificate {
    let allCertificates = certificates.values().toArray();
    let index = allCertificates.findIndex(func(c) { c.verificationId == verificationId });
    switch (index) {
      case (?i) { ?allCertificates[i] };
      case (null) { null };
    };
  };
};

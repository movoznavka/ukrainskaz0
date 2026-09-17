/* =========================================================
   Platform — облік учнів, вхід без пароля за іменем,
   збереження прогресу й ДЗ у Firestore, дані для вчительської
   панелі.
   ========================================================= */
(function (global) {
  const Platform = {};
  const KEY = 'zoshyt_current_student';

  // Перелік уроків платформи (додавайте сюди новий урок, коли створите файл)
  Platform.LESSONS = [
    { id: 'lesson-01', title: 'Урок 1. Моє повсякденне життя',     file: 'lesson-01.html' },
    { id: 'lesson-02', title: 'Урок 2. Їжа — борщ і вареники',      file: 'lesson-02.html' },
    { id: 'lesson-03', title: 'Урок 3. Зовнішність людини',        file: 'lesson-03.html' }
  ];

  Platform.getStudents = function () {
    return (global.PLATFORM_STUDENTS || []).slice();
  };

  Platform.getCurrentStudent = function () {
    return localStorage.getItem(KEY) || null;
  };

  Platform.setCurrentStudent = function (name) {
    localStorage.setItem(KEY, name);
  };

  Platform.logout = function () {
    localStorage.removeItem(KEY);
    location.href = Platform.rootPath() + 'login.html';
  };

  Platform.rootPath = function () {
    const p = location.pathname;
    return (p.includes('/lessons/') || p.includes('/teacher/')) ? '../' : '';
  };

  // Викликати одразу на початку <body> кожної захищеної сторінки,
  // щоб неавторизованого учня одразу відправити на вхід.
  Platform.guard = function () {
    if (!Platform.getCurrentStudent()) {
      location.href = Platform.rootPath() + 'login.html?next=' + encodeURIComponent(location.pathname);
      return false;
    }
    return true;
  };

  function studentRef(name) {
    return window.db.collection('students').doc(name);
  }
  function lessonRef(name, lessonId) {
    return studentRef(name).collection('lessons').doc(lessonId);
  }

  Platform.saveProgress = function (lessonId, data) {
    const student = Platform.getCurrentStudent();
    if (!student || !window.db) return;
    lessonRef(student, lessonId).set(Object.assign({
      studentName: student,
      lessonId: lessonId,
      updatedAt: new Date().toISOString()
    }, data), { merge: true }).catch(function (e) {
      console.warn('Не вдалося зберегти прогрес онлайн:', e);
    });
  };

  Platform.getProgress = function (lessonId) {
    const student = Platform.getCurrentStudent();
    if (!student || !window.db) return Promise.resolve(null);
    return lessonRef(student, lessonId).get().then(function (doc) {
      return doc.exists ? doc.data() : null;
    }).catch(function () { return null; });
  };

  // Отримати весь прогрес усіх учнів по всіх уроках (для вчительської панелі)
  Platform.getAllProgress = function () {
    if (!window.db) return Promise.resolve({});
    const students = Platform.getStudents();
    const jobs = [];
    const result = {};
    students.forEach(function (name) {
      result[name] = {};
      Platform.LESSONS.forEach(function (l) {
        jobs.push(
          lessonRef(name, l.id).get().then(function (doc) {
            result[name][l.id] = doc.exists ? doc.data() : null;
          }).catch(function () { result[name][l.id] = null; })
        );
      });
    });
    return Promise.all(jobs).then(function () { return result; });
  };

  // Підключити сторінку уроку до платформи: бейдж учня, збереження
  // зірок і ДЗ, відновлення попереднього прогресу.
  Platform.initLessonPage = function (lessonId, lessonTitle) {
    const student = Platform.getCurrentStudent();
    if (!student) return;

    const bar = document.querySelector('.progress-bar');
    if (bar) {
      const badge = document.createElement('span');
      badge.className = 'student-badge';
      badge.innerHTML = '👤 ' + student + ' · <a href="#" id="platform-logout" class="back-link" style="opacity:1">Вийти</a>';
      bar.appendChild(badge);
      const lo = document.getElementById('platform-logout');
      if (lo) lo.addEventListener('click', function (e) { e.preventDefault(); Platform.logout(); });
    }

    if (global.LessonKit) {
      const originalAddStar = LessonKit.addStar;
      LessonKit.addStar = function (x, y) {
        originalAddStar(x, y);
        Platform.saveProgress(lessonId, {
          stars: LessonKit.progress.earned,
          totalStars: LessonKit.progress.total,
          lessonTitle: lessonTitle
        });
      };
    }

    const hwList = document.getElementById('hw-list');
    if (hwList) {
      const boxes = Array.from(hwList.querySelectorAll('input[type=checkbox]'));
      function saveHomework() {
        const done = boxes.filter(function (b) { return b.checked; }).length;
        Platform.saveProgress(lessonId, {
          homeworkDone: done,
          homeworkTotal: boxes.length,
          homeworkComplete: done === boxes.length && boxes.length > 0,
          lessonTitle: lessonTitle
        });
      }
      boxes.forEach(function (cb) { cb.addEventListener('change', saveHomework); });
    }

    // Відновити попередній прогрес (зірки, позначки ДЗ) на цьому пристрої
    Platform.getProgress(lessonId).then(function (data) {
      if (!data) return;
      if (typeof data.stars === 'number' && global.LessonKit) {
        LessonKit.progress.earned = data.stars;
        LessonKit.renderProgress();
      }
    });
  };

  global.Platform = Platform;
})(window);

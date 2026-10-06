const ALL = 'All';

let taskColor = null;
let current = ALL;
let pending = null;

const categories = ['Work', 'House', 'Teaching', 'Other'];
const tasks = [];

function renderSidebar() {
  const $list = $('#categoryList').empty();

  [ALL, ...categories].forEach(function (name) {
    const count = name === ALL
      ? tasks.length
      : tasks.filter(function (t) { return t.category === name; }).length;

    const $btn = $('<button type="button" class="catBtn"></button>')
      .attr('data-cat', name)
      .toggleClass('active', name === current)
      .append($('<span></span>').text(name))
      .append($('<span class="catCount"></span>').text(count));

    $list.append($('<li></li>').append($btn));
  });
}

function renderTasks() {
  const $list = $('#taskCount').empty();

  const items = tasks.filter(function (t) {
    return current === ALL || t.category === current;
  });

  if (!items.length) {
    const msg = current === ALL
      ? 'There are no tasks yet. Click "New task" to add the first one.'
      : 'The «' + current + '» category is currently empty. New tasks are added in the "All" tab.';
    $list.append($('<p class="empty"></p>').text(msg));
    return;
  }

  items.forEach(function (t) {
    const $task = $('<div class="task"></div>').css('border-left-color', t.color);
    $task.append($('<span class="taskText"></span>').text(t.text));
    $task.append($('<span class="taskTag"></span>').text(t.category));
    $list.append($task);
  });
}

function setPanelOpen(open) {
  if (open) {
    $('#addPanel').slideDown(150);
    $('#toggleBtn').text('Close').attr('aria-expanded', 'true');
  } else {
    $('#addPanel').slideUp(150);
    $('#toggleBtn').text('+ New task').attr('aria-expanded', 'false');
  }
}

function updateView() {
  const isAll = current === ALL;

  $('#viewTitle').text(current);
  renderSidebar();
  renderTasks();

  $('#toggleBtn').toggle(isAll);
  if (!isAll) {
    setPanelOpen(false);
  }
}

$('#toggleBtn').click(function () {
  setPanelOpen($('#addPanel').is(':hidden'));
});

function selectColor($item) {
  $('.colorItem').removeClass('selected').attr('aria-checked', 'false');
  $item.addClass('selected').attr('aria-checked', 'true');
  taskColor = $item.attr('data-color');
  $('#addBtn').prop('disabled', false);
}

$('.colorItem').click(function () {
  selectColor($(this));
});

$('.colorItem').on('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    selectColor($(this));
  }
});

$('#input').on('keydown', function (e) {
  if (e.key === 'Enter' && !$('#addBtn').prop('disabled')) {
    $('#addBtn').click();
  }
});

$('#addBtn').click(function () {
  const text = $('#input').val().trim();

  if (!text) {
    alert('Заповніть поле');
    return;
  }
  if (!taskColor) {
    return;
  }

  pending = { text: text, color: taskColor };
  openModal();
});

function renderModalCats() {
  const $box = $('#modalCats').empty();
  categories.forEach(function (name) {
    $box.append(
      $('<button type="button" class="modalCat"></button>')
        .attr('data-cat', name)
        .text(name)
    );
  });
}

function openModal() {
  renderModalCats();
  $('#modal').addClass('open').attr('aria-hidden', 'false');
  $('#modalCats .modalCat').first().trigger('focus');
}

function closeModal() {
  $('#modal').removeClass('open').attr('aria-hidden', 'true');
  pending = null;
}

function addTask(category) {
  if (!pending) return;

  tasks.push({ text: pending.text, color: pending.color, category: category });

  $('#input').val('');
  $('.colorItem').removeClass('selected').attr('aria-checked', 'false');
  taskColor = null;
  $('#addBtn').prop('disabled', true);

  closeModal();
  updateView();
}

$('#modalCats').on('click', '.modalCat', function () {
  addTask($(this).attr('data-cat'));
});

$('#cancelBtn').click(closeModal);

$('#modal').click(function (e) {
  if (e.target === this) closeModal();
});

$(document).on('keydown', function (e) {
  if (e.key === 'Escape' && $('#modal').hasClass('open')) closeModal();
});

$('#categoryList').on('click', '.catBtn', function () {
  current = $(this).attr('data-cat');
  updateView();
});

updateView();
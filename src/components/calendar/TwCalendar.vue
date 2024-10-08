<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Calendar, Week, Days } from "../../type";

export interface Props {
  monthNames?: Array<string>;
  dayNames?: Array<string>;
}

const props = withDefaults(defineProps<Props>(), {
  monthNames: () => [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: () => ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
});

// Date View
const calendar = ref<Calendar>();
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

// computed helper to find date based on week & date name
const findDate = computed(() => (week: Week, dateName: string) => {
  return week.days.filter((d) => d.name === dateName)[0];
});

// available views
const view = ref<"date-view" | "month-view" | "year-view">("date-view");

// Generate calendar based on year & month
function generateCalendarRef() {
  // create a new date object for the first day of the current month
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);

  // create an object to store the calendar data
  const generateCalendar: Calendar = {
    month: props.monthNames[currentMonth.value],
    year: currentYear.value,
    weeks: [],
  };

  // fill the calendar data
  const daysInMonth = new Date(
    currentYear.value,
    currentMonth.value + 1,
    0
  ).getDate();
  const day = firstDay.getDay();
  let date = 1;
  let prevMonth = currentMonth.value - 1;
  let prevYear = currentYear.value;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  }
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
  for (let i = 0; i < 6; i++) {
    const week: {
      days: Array<Days>;
    } = {
      days: [],
    };
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < day) {
        week.days.push({
          name: props.dayNames[j],
          date: daysInPrevMonth - (day - j - 1),
          month: props.monthNames[prevMonth],
          year: prevYear,
          fulldate: `${prevYear}-${(prevMonth + 1)
            .toString()
            .padStart(2, "0")}-${(daysInPrevMonth - (day - j - 1))
            .toString()
            .padStart(2, "0")}`,
          jsDate: new Date(
            Date.UTC(
              currentYear.value,
              prevMonth,
              daysInPrevMonth - (day - j - 1)
            )
          ),
        });
      } else {
        if (date <= daysInMonth) {
          week.days.push({
            name: props.dayNames[j],
            date: date,
            month: props.monthNames[currentMonth.value],
            year: currentYear.value,
            fulldate: `${currentYear.value}-${(currentMonth.value + 1)
              .toString()
              .padStart(2, "0")}-${date.toString().padStart(2, "0")}`,
            jsDate: new Date(
              Date.UTC(currentYear.value, currentMonth.value, date)
            ),
          });
          date++;
        } else {
          let nextMonth = currentMonth.value + 1;
          let nextYear = currentYear.value;
          if (nextMonth > 11) {
            nextMonth = 0;
            nextYear++;
          }
          week.days.push({
            name: props.dayNames[j],
            date: date - daysInMonth,
            month: props.monthNames[nextMonth],
            year: nextYear,
            fulldate: `${nextYear}-${(nextMonth + 1)
              .toString()
              .padStart(2, "0")}-${(date - daysInMonth)
              .toString()
              .padStart(2, "0")}`,
            jsDate: new Date(Date.UTC(nextYear, nextMonth, date - daysInMonth)),
          });
          date++;
        }
      }
    }
    generateCalendar.weeks.push(week);
  }

  calendar.value = generateCalendar;
}

function datePrev() {
  if (currentMonth.value - 1 === 0) {
    currentYear.value = currentYear.value - 1;
    currentMonth.value = 11;
  } else {
    currentMonth.value--;
  }
  generateCalendarRef();
}

function dateNext() {
  if (currentMonth.value + 1 > 11) {
    currentYear.value = currentYear.value + 1;
    currentMonth.value = 0;
  } else {
    currentMonth.value++;
  }
  generateCalendarRef();
}
// End Date View

// Month View
const tempYear = ref(new Date().getFullYear());

function monthPrev() {
  tempYear.value--;
}

function monthNext() {
  tempYear.value++;
}

function monthChoose(monthIndex: number) {
  currentMonth.value = monthIndex;
  currentYear.value = tempYear.value;
  generateCalendarRef();
  view.value = "date-view";
}
// End Month view

// Year View
const minYear = ref(new Date().getFullYear() - 10);
const maxYear = ref(new Date().getFullYear() + 10);

function yearPrev() {
  minYear.value = minYear.value - 20;
  maxYear.value = maxYear.value - 20;
}

function yearNext() {
  minYear.value = minYear.value + 20;
  maxYear.value = maxYear.value + 20;
}

function yearChoose(year: number) {
  tempYear.value = year;
  view.value = "month-view";
}
// End Year View

onMounted(() => {
  generateCalendarRef();
});
</script>

<template>
  <div
    class="bg-white dark:bg-gray-700 p-4 rounded shadow grid gap-4 w-full"
    v-if="calendar"
  >
    <!-- Date View -->
    <template v-if="view === 'date-view'">
      <div class="flex justify-between gap-4">
        <button
          class="text-2xl font-bold hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left p-2 flex items-center rounded"
          @click="view = 'month-view'"
        >
          {{ calendar.month }}
          {{ calendar.year }}
        </button>
        <div class="flex gap-2 justify-end items-center">
          <button
            class="w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center rounded duration-300 ease-in-out"
            @click="datePrev"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
              />
            </svg>
          </button>
          <button
            class="w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center rounded duration-300 ease-in-out"
            @click="dateNext"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th
              class="p-4 border dark:border-gray-400"
              v-for="day in props.dayNames"
              :key="day"
            >
              {{ day }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, index) in calendar.weeks" :key="`week-${index}`">
            <td
              class="hover:bg-gray-50 dark:hover:bg-gray-600 border dark:border-gray-400 relative"
              :class="{
                'text-gray-400 hover:bg-white':
                  (index === 0 && findDate(week, day).date > 15) ||
                  (index > 3 && findDate(week, day).date < 15),
              }"
              v-for="day in props.dayNames"
              :key="findDate(week, day).jsDate.toDateString()"
            >
              <div class="p-4">
                <slot name="date" :date="findDate(week, day)">
                  <div
                    class="absolute top-2 right-2"
                    :class="{
                      'bg-gray-600 text-white rounded w-6 h-6 flex items-center justify-center':
                        findDate(week, day).jsDate.toDateString() ===
                        new Date().toDateString(),
                    }"
                  >
                    {{ findDate(week, day).date }}
                  </div>
                  &nbsp;
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <!-- End Date View -->

    <!-- Month View -->
    <template v-else-if="view === 'month-view'">
      <div class="flex justify-between gap-4">
        <button
          class="text-2xl font-bold hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left p-2 flex items-center rounded"
          @click="view = 'year-view'"
        >
          {{ tempYear }}
        </button>
        <div class="flex gap-2 justify-end items-center">
          <button
            class="w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center rounded duration-300 ease-in-out"
            @click="monthPrev"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
              />
            </svg>
          </button>
          <button
            class="w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center rounded duration-300 ease-in-out"
            @click="monthNext"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-4">
        <button
          class="h-36 hover:bg-gray-200 dark:hover:bg-gray-600 flex justify-center items-center text-lg duration-300 ease-in-out border dark:border-gray-400"
          v-for="(month, index) in props.monthNames"
          :key="`month-${index}`"
          @click="monthChoose(index)"
          :class="{
            'font-bold':
              month === calendar.month && tempYear === calendar.year,
          }"
        >
          {{ month }}
        </button>
      </div>
    </template>
    <!-- End Month View -->

    <!-- Year View -->
    <template v-else-if="view === 'year-view'">
      <div class="flex justify-between gap-4">
        <button
          class="text-2xl font-bold w-full text-left p-2 flex items-center rounded text-gray-600 dark:text-gray-400 cursor-not-allowed"
        >
          {{ minYear + 1 }} - {{ maxYear }}
        </button>
        <div class="flex gap-2 justify-end items-center">
          <button
            class="w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center rounded duration-300 ease-in-out"
            @click="yearPrev"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
              />
            </svg>
          </button>
          <button
            class="w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center rounded duration-300 ease-in-out"
            @click="yearNext"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-4">
        <button
          class="h-16 text-lg text-center hover:bg-gray-200 dark:hover:bg-gray-600 border dark:border-gray-400 flex items-center justify-center duration-300 ease-in-out"
          v-for="i in 20"
          :key="`year-${i}`"
          @click="yearChoose(minYear + i)"
        >
          {{ minYear + i }}
        </button>
      </div>
    </template>
    <!-- End Year View -->
  </div>
</template>

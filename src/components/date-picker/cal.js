import s from './date-picker.scss'
import Flex from '../flex'
import lng from './lng'
import getDay from './get-day'
import delegate from 'delegate-to'
import TimePicker from '../time-picker'

const DatePickerCal = {
  name: 'DatePickerCal',
  props: {
    yearMonth: {
      type: Array,
      default: () => [(new Date).getFullYear(), (new Date).getMonth() + 1],
    },

    min: {
      type: Date,
    },

    max: {
      type: Date,
    },

    firstDayOfWeek: {
      type: Number,
      default: 1,
    },

    colorfulWeekend: {
      type: Boolean,
      default: false,
    },

    hasTime: {
      type: Boolean,
    },

    timeProps: {
      type: Object,
    },
  },

  data() {
    const [year, month] = this.yearMonth

    return {
      value: '',
      year,
      month,
    }
  },

  watch: {
    yearMonth(newYearMonth) {
      const [year, month] = newYearMonth

      this.year = year
      this.month = month
    },
  },

  methods: {
    pick: delegate(`.${s.date}`, function (ev) {
      const { delegateTarget } = ev
      const isToday = delegateTarget.classList.contains(s.today)
      if (isToday) {
        return
      }

      const { year, month, $refs, hasTime } = this
      const date = delegateTarget.getAttribute('data-date')
      const day = delegateTarget.getAttribute('data-day')

      let h = 0, m = 0, time = ''

      if (hasTime) {
        time = $refs.time.value
        ;[h, m] = time.split(':')
      }

      const D = new Date(year, (month - 1), date, h, m)

      this.pickerDate = {
        date: +date,
        day: +day,
        year,
        month,
        Date: D,
        ts: +D / 1000,
        hour: +h,
        minute: +m,
        time,
      }
      this.$emit('pick', this.pickerDate)
    }),

    prev(ev) {
      if (ev && ev.currentTarget.getAttribute('ignore')) {
        return
      }

      const { month, year } = this
      let prevMonth = month - 1
      if (prevMonth < 1) {
        this.year = year - 1

        prevMonth = 12
      }
      this.month = prevMonth

      this.$emit('prev', {
        year: this.year,
        month: this.month,
      })
    },
    next(ev) {
      if (ev && ev.currentTarget.getAttribute('ignore')) {
        return
      }

      const { month, year } = this
      let nextMonth = month + 1

      if (nextMonth > 12) {
        this.year = year + 1

        nextMonth = 1
      }
      this.month = nextMonth

      this.$emit('next', {
        year: this.year,
        month: this.month,
      })
    },

    inTime() {
      this.$emit('time', 'in')
    },

    outTime() {
      this.$emit('time', 'out')
    },

    onTimeChange(d) {
      if (this.pickerDate) {
        this.$emit('timeChange', {
          ...this.pickerDate,
          time: d.value,
        })
      } else {
        const { year, month } = this
        const { h, m } = d
        const date = new Date().getDate()

        const D = new Date(year, (month - 1), date, h, m)

        this.$emit('timeChange', {
          year,
          month,
          date,
          day: D.getDay(),
          Date: D,
          ts: +D / 1000,
          hour: h,
          minute: m,
          time: d.value,
        })
      }
    },

    onTimeBlur() {
      this.$emit('timeBlur')
    },
  },

  computed: {
    days() {
      const { firstDayOfWeek } = this
      const days = Object.keys(lng.days)

      return days.map((day, i) => {
        day = firstDayOfWeek ? (i + firstDayOfWeek) % days.length : day

        return <th data-day={day}>{ lng.days[day].slice(0, 2) }</th>
      })
    },

    calendar() {
      /**
       * very heavy logic here!! Be careful to modify.
       */
      const { year, month, firstDayOfWeek, min, max } = this
      const { firstDay, lastDate } = getDay(year, month)
      const now = new Date

      let start = 0
      let day = firstDayOfWeek - 1
      return [...Array(6)].map((n, rowIdx) => {
        return (
          <tr>
            {[...Array(7)].map((n, dayIdx) => {
              let date
              day += 1
              if (rowIdx === 0) {
                const range = firstDay || 7

                date = (firstDayOfWeek !== firstDay && (range - firstDayOfWeek) > dayIdx)
                  ? null
                  : start += 1
              } else {
                start += 1
                date = (start > lastDate)
                  ? null
                  : start
              }

              const isToday = date === now.getDate() &&
                now.getFullYear() === year &&
                now.getMonth() === month - 1

              const DD = new Date(year, month - 1, date)

              const classes = {
                [s.today]: isToday,
                [s.dateNull]: date === null,
                [s.dateIgnore]: (min && DD <= min) || (max && DD >= max),
              }

              return (
                <td>
                  <span class={[s.date, classes]} data-date={date} data-day={day % 7}>
                    { date }
                  </span>
                </td>
              )
            })}
          </tr>
        )
      })
    },

    css() {
      const { colorfulWeekend } = this

      return {
        [s.colorfulWeekend]: colorfulWeekend,
      }
    },
  },

  render(h) {
    const { prev, next, pick, year, month, days, calendar, min, max, css,
      inTime, outTime, onTimeChange, timeProps, hasTime, onTimeBlur } = this

    return (
      <div class={[s.calBox, css]}>
        <Flex split class={[s.calTop]}>
          <Flex.Col>
            { year }
            <strong>
              { lng.months[month - 1] }
            </strong>
          </Flex.Col>
          <Flex.Col>
            <Flex>
              { hasTime &&
                <Flex.Col>
                  <div onMouseenter={inTime} onMouseleave={outTime}>
                    <TimePicker ref="time" onChange={onTimeChange}
                                onBlur={onTimeBlur}
                                style={{ width: '70px' }} {...{ props: timeProps }} />
                  </div>
                </Flex.Col>
              }

              <Flex.Col>
                <span ignore={min && year <= min.getFullYear() && month <= min.getMonth() + 1}
                      class={[s.calPrev]}
                      onClick={prev}>
                  {'<'}
                </span>
                <span ignore={max && year >= max.getFullYear() && month >= max.getMonth() + 1}
                      class={[s.calNext]}
                      onClick={next}>
                  {'>'}
                </span>
              </Flex.Col>
            </Flex>
          </Flex.Col>
        </Flex>
        <table class={[s.calTable]}>
          <thead>
          <tr>
            { days }
          </tr>
          </thead>
          <tbody onClick={pick}>
          { calendar }
          </tbody>
        </table>
      </div>
    )
  },
}

module.exports = DatePickerCal

"use client";

import { useMemo } from "react";
import { format, isSameMonth, isToday } from "date-fns";
import { FaStar } from "react-icons/fa";
import type { Theme, CalendarEvent, Language } from "../../types";
import { getPosterUrl } from "../../services";
import { WEEKDAYS_KO, WEEKDAYS_EN } from "../../constants";
import {
  getDayType,
  getCalendarDays,
  isMovieRecommended,
  formatTooltipDate,
} from "../../utils";
import {
  WeekdayHeader,
  WeekdayCell,
  CalendarGrid as Grid,
  DayCell,
  DateNumber,
  EventsContainer,
  EventItem,
  EventPoster,
  EventTitle,
  RecommendStar,
} from "./styles";

interface CalendarGridProps {
  theme: Theme;
  language: Language;
  currentDate: Date;
  eventsByDate: Map<string, CalendarEvent[]>;
  isMobile: boolean;
  t: (key: string) => string;
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarGridView({
  theme,
  language,
  currentDate,
  eventsByDate,
  isMobile,
  t,
  onEventClick,
}: CalendarGridProps) {
  const weekdays = language === "ko" ? WEEKDAYS_KO : WEEKDAYS_EN;
  const calendarDays = useMemo(
    () => getCalendarDays(currentDate),
    [currentDate]
  );

  return (
    <>
      <WeekdayHeader $theme={theme}>
        {weekdays.map((day, index) => (
          <WeekdayCell key={day} $dayType={getDayType(index)} $theme={theme}>
            {day}
          </WeekdayCell>
        ))}
      </WeekdayHeader>

      <Grid>
        {calendarDays.map((day, index) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDate.get(dateKey) || [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const dayOfWeek = day.getDay();

          return (
            <DayCell
              key={index}
              $isCurrentMonth={isCurrentMonth}
              $isToday={isToday(day)}
              $theme={theme}
            >
              <DateNumber
                $isCurrentMonth={isCurrentMonth}
                $dayType={getDayType(dayOfWeek)}
                $isToday={isToday(day)}
                $theme={theme}
              >
                <span>{format(day, "d")}</span>
              </DateNumber>

              <EventsContainer $theme={theme}>
                {dayEvents.map((event) => {
                  const recommended = isMovieRecommended(event.movie);
                  const releaseDate = new Date(event.movie.release_date);
                  const formattedDate = formatTooltipDate(
                    releaseDate,
                    language
                  );

                  const tooltipHtml = `
                    <div style="display: flex; gap: 10px; align-items: flex-start; max-width: 280px;">
                      ${
                        event.movie.poster_path
                          ? `<img src="${getPosterUrl(
                              event.movie.poster_path,
                              "w185"
                            )}" style="width: 50px; border-radius: 4px;" />`
                          : ""
                      }
                      <div style="flex: 1;">
                        <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">${
                          event.title
                        }</div>
                        <div style="font-size: 11px; opacity: 0.9;">${formattedDate}</div>
                        ${
                          recommended
                            ? `<div style="font-size: 11px; margin-top: 4px;">${t(
                                "tooltip.recommended"
                              )}</div>`
                            : ""
                        }
                      </div>
                    </div>
                  `;

                  return (
                    <EventItem
                      key={event.id}
                      $isRecommended={recommended}
                      onClick={() => onEventClick(event)}
                      data-tooltip-id={
                        isMobile
                          ? undefined
                          : recommended
                          ? "recommend-tooltip"
                          : "general-tooltip"
                      }
                      data-tooltip-html={isMobile ? undefined : tooltipHtml}
                    >
                      {event.movie.poster_path && (
                        <EventPoster
                          src={getPosterUrl(event.movie.poster_path, "w185")}
                          alt=""
                        />
                      )}
                      <EventTitle>{event.title}</EventTitle>
                      {recommended && (
                        <RecommendStar>
                          <FaStar />
                        </RecommendStar>
                      )}
                    </EventItem>
                  );
                })}
              </EventsContainer>
            </DayCell>
          );
        })}
      </Grid>
    </>
  );
}

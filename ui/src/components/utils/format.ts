// This file is part of Prusa-Connect-Local
// Copyright (C) 2018-2019 Prusa Research s.r.o. - www.prusa3d.com
// SPDX-License-Identifier: GPL-3.0-or-later

export function numberFormat(value: number) {
  if (value > 0) {
    return value.toFixed(1);
  } else {
    return 0;
  }
}

export function formatTime(
  value: number,
  less_than: string = null,
  na: string = null
) {
  if (value) {
    if (value < 60000) {
      return less_than;
    }
    const minutes = Math.floor((value / 60000) % 60);
    const hours = Math.floor((value / 3600000) % 24);
    if (hours > 0) {
      return hours + " h " + minutes + " min";
    }
    if (minutes > 0) {
      return minutes + " minutes";
    }
  } else {
    return na;
  }
}

export function formatEstimatedTime(value: number) {
  if (value) {
    let now = new Date();
    let end = new Date(now.getTime() + value);
    const days = Math.abs(end.getDate() - now.getDate());
    let plus_days = "";
    if (days == 1) {
      plus_days = "Tomorrow ";
    } else if (days > 1) {
      plus_days = `${days} D+ `;
    }
    return (
      plus_days +
      (("0" + end.getHours()).substr(-2) +
        ":" +
        ("0" + end.getMinutes()).substr(-2))
    );
  } else {
    return "00:00";
  }
}

export function available(value: number | string, unit: string = null) {
  return value ? value + (unit ? " " + unit : "") : "NA";
}

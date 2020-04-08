// This file is part of Prusa-Connect-Local
// Copyright (C) 2018-2019 Prusa Research s.r.o. - www.prusa3d.com
// SPDX-License-Identifier: GPL-3.0-or-later

import { h, Component, Fragment } from "preact";
import { Translation } from "react-i18next";

import { network } from "../../utils/network";
import Title from "../../title";
import { YesButton, NoButton } from "../../buttons";

interface P extends network {
  onBack(e: MouseEvent): void;
}

interface S {
  exposure_time_ms: number;
  exposure_time_first_ms: number;
}

interface ValuesProps {
  id: string;
  title: string;
  value: number;
  onChange(id: string, value: number): void;
  pvalue: number;
}

const range = {
  exposure_time_ms: [1, 60],
  exposure_time_first_ms: [10, 120]
};

const SetValueView: preact.FunctionalComponent<ValuesProps> = props => {
  const { id, title, value, onChange, pvalue } = props;
  const [min, max] = range[id];

  const onIncrease = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let newValue = value + pvalue;
    if (min <= newValue && newValue <= max) {
      onChange(id, newValue);
    }
  };

  const onDecrease = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let newValue = value - pvalue;
    if (min <= newValue && newValue <= max) {
      onChange(id, newValue);
    }
  };

  const onkeyPress = (e: KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let newValue;
    if (e.key == "=" || e.key == "+") {
      newValue = value + pvalue;
    } else if (e.key == "-") {
      newValue = value - pvalue;
    }

    if (min <= newValue && newValue <= max) {
      onChange(id, newValue);
    }
  };

  return (
    <div class="columns prusa-no-focus" tabIndex={0} onKeyDown={onkeyPress}>
      <div class="column is-half">
        <p class="prusa-default-text">{title}</p>
      </div>
      <div class="column">
        <img
          class="media-left image is-24x24 prusa-job-set-value"
          src={require("../../../assets/minus_color.svg")}
          onClick={e => onDecrease(e)}
        />
      </div>
      <div class="column">{value}</div>
      <div class="column">
        <img
          class="media-left image is-24x24 prusa-job-set-value"
          src={require("../../../assets/plus_color.svg")}
          onClick={e => onIncrease(e)}
        />
      </div>
    </div>
  );
};

class ExposureTimes extends Component<P, S> {
  state = {
    exposure_time_ms: range.exposure_time_ms[0],
    exposure_time_first_ms: range.exposure_time_first_ms[0]
  };

  onChange = (id: string, value: number) => {
    this.setState(prevState => ({ ...prevState, [id]: value }));
  };

  onSave = (e: MouseEvent) => {
    this.props.onFetch({
      url: "/api/properties",
      then: response => this.props.onBack(e),
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          exposure_time_ms: this.state.exposure_time_ms * 1000,
          exposure_time_first_ms: this.state.exposure_time_first_ms * 1000
        })
      }
    });
  };

  componentDidMount = () => {
    this.props.onFetch({
      url: "/api/properties?values=exposure_time_ms,exposure_time_first_ms",
      then: response =>
        response.json().then(data => {
          this.setState(prev => ({
            exposure_time_ms: data.exposure_time_ms
              ? data.exposure_time_ms / 1000
              : prev.exposure_time_ms,
            exposure_time_first_ms: data.exposure_time_first_ms
              ? data.exposure_time_first_ms / 1000
              : prev.exposure_time_first_ms
          }));
        })
    });
  };

  render({ onBack, onFetch }, { exposure_time_ms, exposure_time_first_ms }) {
    return (
      // @ts-ignore
      <Translation useSuspense={false}>
        {(t, { i18n }, ready) =>
          ready && (
            <Fragment>
              <Title title={t("exp-times.title")} onFetch={onFetch} />
              <div class="columns is-multiline is-mobile is-centered is-vcentered">
                <div class="column is-half prusa-job-question">
                  <SetValueView
                    id="exposure_time_ms"
                    title={t("prop.exp-time")}
                    value={exposure_time_ms}
                    onChange={this.onChange}
                    pvalue={0.5}
                  />
                  <SetValueView
                    id="exposure_time_first_ms"
                    title={t("prop.layer-1st")}
                    value={exposure_time_first_ms}
                    onChange={this.onChange}
                    pvalue={1}
                  />
                </div>
                <div class="column is-full">
                  <div class="prusa-button-wrapper">
                    <YesButton
                      text={t("btn.save-chgs").toLowerCase()}
                      onClick={this.onSave}
                      wrap
                    />
                    <NoButton
                      text={t("btn.cancel").toLowerCase()}
                      onClick={onBack}
                      wrap
                    />
                  </div>
                </div>
              </div>
            </Fragment>
          )
        }
      </Translation>
    );
  }
}

export default ExposureTimes;

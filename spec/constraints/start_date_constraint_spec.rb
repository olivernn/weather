require 'spec_helper'

describe StartDateConstraint do
  describe "#matches?" do
    let(:params) { {
      year: test_date.year,
      month: test_date.month,
      day: test_date.day,
      hour: test_date.hour
    } }

    let(:earliest_observation_date) { 2.weeks.ago }
    let(:request) { double(params: params) }
    let(:constraint) { StartDateConstraint.new(earliest_observation_date) }

    subject { constraint.matches?(request) }

    context "dates before the earliest observation" do
      let(:test_date) { earliest_observation_date - 1.day }
      it { should be_false }
    end

    context "dates between the earliest observation and today" do
      let(:test_date) { earliest_observation_date + 1.day }
      it { should be_true }
    end

    context "dates in the future" do
      let(:test_date) { 1.day.from_now }
      it { should be_false }
    end

    context "dates that are human like" do
      let(:earliest_observation_date) { DateTime.new(2012, 1, 1) }
      let(:params) { {
        :year => '2013',
        :month => '01',
        :day => '01',
        :hour => '01'
      } }

      it { should be_true }
    end

    context "invalid dates" do
      let(:params) { {
        :year => '2012',
        :month => '13',
        :day => '77',
        :hour => '44'
      } }

      it { should be_false }
    end
  end
end

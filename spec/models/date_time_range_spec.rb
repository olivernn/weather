require 'spec_helper'

describe DateTimeRange do
  describe "#start" do
    let(:year) { '2013' }
    let(:month) { '01' }
    let(:date) { '09' }
    let(:hour) { '08' }

    let(:date_time_range) { DateTimeRange.new(year, month, date, hour) }

    subject { date_time_range.start }

    its(:year) { should == 2013 }
    its(:month) { should == 1 }
    its(:day) { should == 9 }
    its(:hour) { should == 8 }
    its(:minute) { should == 0 }
  end

  describe "#end" do
    let(:date_time_range) { DateTimeRange.new(
      start_date.year,
      start_date.month,
      start_date.day,
      start_date.hour
    ) }

    subject { date_time_range.end }

    context "start is more than or exactly 2 weeks ago" do
      let(:start_date) { 14.days.ago.beginning_of_day }

      it { should == start_date + 14.days }
    end

    context "start is less than 2 weeks ago" do
      let(:start_date) { 2.days.ago.beginning_of_day }
      let(:end_date) { Time.now.at_beginning_of_day }

      its(:year) { should == end_date.year }
      its(:month) { should == end_date.month }
      its(:day) { should == end_date.day }
      its(:hour) { should == end_date.hour }
      its(:minute) { should == 0 }
    end
  end

  describe ".ending_now" do
    let(:date_time_range) { DateTimeRange.ending_now }

    context "#start" do
      subject { date_time_range.start }
      it { should == 14.days.ago.at_beginning_of_day }
    end

    context "#end" do
      subject { date_time_range.end }
      it { should == DateTime.now.at_beginning_of_day }
    end
  end

  describe "#duration" do
    let(:date_time_range) { DateTimeRange.ending_now }
    subject { date_time_range.duration }

    it { should == 14 }
  end
end

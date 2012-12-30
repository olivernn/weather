require 'spec_helper'

describe Observation do
  describe ".on_date" do
    let!(:observation_1) { Observation.create(date: Date.new(2012, 12, 11)) }
    let!(:observation_2) { Observation.create(date: Date.new(2012, 12, 12)) }
    let!(:observation_3) { Observation.create(date: Date.new(2012, 12, 13)) }

    subject { Observation.on_date(Date.new(2012, 12, 12)) }

    it { should_not include(observation_1) }
    it { should include(observation_2) }
    it { should_not include(observation_3) }
  end
end

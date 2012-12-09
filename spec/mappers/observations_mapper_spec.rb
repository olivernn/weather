require 'spec_helper'

describe ObservationsMapper do
  describe "#to_a" do
    let(:raw) { {
      "i"=> "3002",
      "lat"=> "60.749",
      "lon"=> "-0.854",
      "name"=> "BALTASOUND",
      "country"=> "SCOTLAND",
      "continent"=> "EUROPE",
      "Period"=> [{
        "type"=> "Day",
        "value"=> "2012-12-07Z",
        "Rep"=> {
          "D"=> "SW",
          "P"=> "1016",
          "S"=> "7",
          "T"=> "0.8",
          "V"=> "50000",
          "W"=> "7",
          "$"=> "1380"
        }
      }]
    } }

    subject { ObservationsMapper.new(raw).to_a.first }

    it { subject[:date].should == DateTime.new(2012, 12, 07, 23) }
    it { subject[:temperature].should == 0.8 }
    it { subject[:visibility].should == 50000 }
    it { subject[:wind_direction].should == 'SW' }
    it { subject[:wind_speed].should == 7 }
    it { subject[:weather_type].should == 7 }
    it { subject[:pressure].should == 1016 }
  end
end

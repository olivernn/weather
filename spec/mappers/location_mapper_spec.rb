require 'spec_helper'

describe LocationMapper do
  describe "#to_h" do
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

    subject { LocationMapper.new(raw).to_h }

    it { subject[:ref].should == 3002 }
    it { subject[:lat].should == 60.749 }
    it { subject[:lng].should == -0.854 }
    it { subject[:name].should == 'Baltasound' }
    it { subject[:country].should == 'Scotland' }
    it { subject[:continent].should == 'Europe' }
  end
end

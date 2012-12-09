require 'spec_helper'
require 'met_office_api'

describe DailyImporter do
  describe '.run' do
    before do
      MetOfficeApi.stub!(:observations).and_return(JSON.parse(File.new(Rails.root.join('spec', 'fixtures', 'observation.json')).read))
    end

    context 'importing locations' do
      it 'should create a new location if an existing location does not exist' do
        expect {
          DailyImporter.run!
        }.to change(Location, :count).by(1)
      end

      it 'should not create new locations if one already exists' do
        Location.create(ref: 3002) # 3002 is the ref of the location in the fixture

        expect {
          DailyImporter.run!
        }.to change(Location, :count).by(0)
      end
    end

    context 'importing observations' do
      it 'should import an observation for each observation in the data' do
        expect {
          DailyImporter.run!
        }.to change(Observation, :count).by(1)
      end

      it 'should not create duplicate observations based on date' do
        location = Location.create(ref: 3002) # 3002 is the ref of the location in the fixture
        location.observations.create(date: DateTime.new(2012, 12, 7, 23)) # 2012-12-07T23:00:00Z is the time of the observation in the fixuter

        expect {
          DailyImporter.run!
        }.to change(Observation, :count).by(0)
      end

      it 'should associate an observation with a location' do
        DailyImporter.run!
        Observation.first.location.should == Location.first
      end
    end
  end
end

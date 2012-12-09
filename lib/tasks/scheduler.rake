desc "Imports daily information from MetOffice"
task :met_office_import => :environment do
  DailyImporter.run!
end

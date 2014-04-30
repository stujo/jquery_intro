# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

def seeder model, key, data
  item = model.where({key => data[key]}).first
  if item.nil?
    puts "Seeding #{model.name} #{data[key]}"
    item = model.create(data)
  end
end

puts "Loading Chapters"
load File.expand_path(File.dirname(__FILE__) + '/chapters_auto_seeder_sample.txt')

puts "Loading Examples"
load File.expand_path(File.dirname(__FILE__) + '/examples_auto_seeder_sample.txt')
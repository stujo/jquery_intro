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

intro = seeder Chapter, :name,  {number: 1, name: 'Introduction'}
rwexamples = seeder Chapter, :name,  {number: 2, name: 'Real World Examples'}


password_strength = seeder Example, :name,  {number: 1, name: 'Password Strength', chapter: rwexamples}
carousel = seeder Example, :name,  {number: 2, name: 'Carousel', chapter: rwexamples}








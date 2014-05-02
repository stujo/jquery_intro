class Chapter < ActiveRecord::Base
  has_many :examples, ->{ order(:number) }

  after_commit :add_to_auto_seed, on: [:create]

  default_scope {order(:number)}

  def url_tag
    self.name.parameterize.underscore
  end


  def add_to_auto_seed
    File.open(auto_seeder_file, "a") do |file|
#      file.write("seeder Chapter, :name,  {number: #{self.number}, name: '#{self.name}'}\n")
      file.write("seeder Chapter, :name,  #{self.attributes.symbolize_keys.slice(:name, :number)}\n")
    end
  end

  def auto_seeder_file
    "#{Rails.root}/db/chapters_auto_seeder_sample.txt"
  end
end

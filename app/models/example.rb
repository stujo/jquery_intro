class Example < ActiveRecord::Base
  belongs_to :chapter
  default_scope {order(:number)}

  before_save :set_template, :set_number
  after_commit :ensure_templates, on: [:create]
  after_commit :add_to_auto_seed, on: [:create]


  def set_number
    if self.number.nil?
      if self.chapter.nil?
        self.number = 0
      else
        self.number = self.chapter.examples.count + 1
      end
    end
  end

  def url_tag
    self.name.parameterize.underscore
  end

  def set_template
    unless self.template_name
      self.template_name = "#{chapter.url_tag}/#{url_tag}"
    end
  end


  def ensure_templates
    self.template_name = "#{chapter.url_tag}/#{url_tag}"

    Dir.mkdir(chapter_examples_dir, 0777) unless File.directory?(self.chapter_examples_dir)

    #touch files
    File.open(example_js_file_path, 'w') do |f|
      f.write("/** Example:  #{self.name.parameterize} **/")
    end unless File.exist? example_js_file_path
    File.open(example_html_file_path, 'w') do |f|
      f.write("<!-- Example:  #{self.name.parameterize} -->")
    end unless File.exist? example_html_file_path
  end

  def add_to_auto_seed
    File.open(auto_seeder_file, "a") do |file|
#      file.write("seeder Example, :name,  {number: #{self.number}, name: '#{self.name}', chapter_id: #{self.chapter_id}}\n")
      file.write("seeder Example, :name,  #{self.attributes.symbolize_keys.slice(:name, :number, :description)} do |example| example.chapter=Chapter.find_by(name: \"#{self.chapter.name}\"); end\n")
    end
  end

  def example_html_file_path
    "#{chapter_examples_dir}/#{self.url_tag}.html"
  end

  def example_js_file_path
    "#{chapter_examples_dir}/#{self.url_tag}.js"
  end

  def chapter_examples_dir
    "#{Rails.root}/app/assets/example_code/#{self.chapter.url_tag}"
  end

  def auto_seeder_file
    "#{Rails.root}/db/examples_auto_seeder_sample.txt"
  end

end

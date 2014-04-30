class Chapter < ActiveRecord::Base
  has_many :examples

  default_scope :order => 'number'

  def url_tag
    self.name.parameterize.underscore
  end

end

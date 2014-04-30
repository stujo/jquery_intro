require 'spec_helper'

describe "chapters/edit" do
  before(:each) do
    @chapter = assign(:chapter, stub_model(Chapter,
      :name => "MyString",
      :number => 1
    ))
  end

  it "renders the edit chapter form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", chapter_path(@chapter), "post" do
      assert_select "input#chapter_name[name=?]", "chapter[name]"
      assert_select "input#chapter_number[name=?]", "chapter[number]"
    end
  end
end
